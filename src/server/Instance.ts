import { config } from ".";
import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';
import * as hapi from '@hapi/hapi';
import { UserListUtils } from './UserListUtils';
import { logger } from "./logger";
import { QueryResponseBody, Vowel } from "../common/PayloadUtils";

export class Instance{

    corpusMap: Map<string, sqlite.Database> = new Map();
    userList?: Map<string, UserListUtils.UserInfo> = new Map();
    authDatabase?: sqlite.Database;
    server: hapi.Server = hapi.server({
        port: config.port,
        host: config.host,
    });;

    async connectCorpusDatabase(){
        config.corpus.forEach(async corpus=>{
            try{
                this.corpusMap.set(corpus.name, await sqlite.open({
                    filename: corpus.path,
                    driver: sqlite3.Database,
                }));
                logger.info(`Corpus database %s connected.`, corpus.name);
            }catch(e: any){
                logger.fatal(`Unable to connect corpus database %s.\n%s`, corpus.name, e.stack ?? e);
                process.exit(1);
            }
            
        });
    }

    async readAuth(){
        try{
            this.userList = UserListUtils.getUserList();
            if(config.authority){
                this.authDatabase = await sqlite.open({
                    filename: config.authority.db,
                    driver: sqlite3.Database,
                });
                logger.info('Auth data loaded');
            }
        }catch(e: any){
            logger.fatal(`Unable to load auth data.\n%s`, e.stack ?? e);
            process.exit(1);
        }
        
    }

    async startHttpServer(){
        try{
            await this.server.start();
            logger.log('Http server started at %s', this.server.info.uri);
        }catch(e: any){
            logger.fatal(`Unable to start http server.\n%s`, e.stack ?? e);
            process.exit(1);
        }
    }

    async init(){
        await this.connectCorpusDatabase();
        await this.readAuth();
        await this.startHttpServer();
    }

    hasUser(accessKey: string){
        if(!this.userList)return true;
        return this.userList.has(accessKey);
    }

    async getQueryNumbers(accessKey: string){
        if(this.authDatabase && this.userList){
            let entry = this.userList.get(accessKey);
            if(!entry){
                throw new Error(`User not exist: ${accessKey}`);
            }
            let total = entry.maxQueries;
            let res = await this.authDatabase.get(`SELECT * FROM auth WHERE access_key = ?`,accessKey);
            if(res){
                if(Math.floor(Date.now()/86400000) > Math.floor(new Date(res.last_query_time).getTime()/86400000)){
                    await this.authDatabase.run(
                        `UPDATE auth SET query_used = 0, last_query_time = ? WHERE access_key = ?`,
                        (new Date()).toISOString().split('T')[0],
                        accessKey,
                    );
                    return {total, available: total};
                }else{
                    return {total, available: total - res.query_used}
                }
            }else{
                await this.authDatabase.run(
                    `INSERT INTO auth VALUES (?,0,?)`,
                    accessKey,
                    (new Date()).toISOString().split('T')[0],
                );
                return {total, available: total};
            }
        }
        return {
            total: -1,
            available: -1,
        }
    }

    async updateUserQuery(accessKey: string, count: number){
        if(!this.authDatabase)return true;
        let queryNumberInfo = await this.getQueryNumbers(accessKey);
        if(queryNumberInfo.total == -1)return true;
        if(queryNumberInfo.available < count) return false;
        await this.authDatabase.run(
            `UPDATE auth SET query_used = ?, last_query_time = ? WHERE access_key = ?`,
            queryNumberInfo.total - queryNumberInfo.available + count,
            (new Date()).toISOString().split('T')[0],
            accessKey,
        );
        return true;
    }

    async invokeQuery(
        corpus: string, 
        vowels: Vowel[], 
        patternsInclude: string[], 
        patternsExclude: string[], 
        count: number
    ){
        let queryPrefix = 'SELECT * FROM lines WHERE';
        let querySuffix = `ORDER BY random() LIMIT ${count}`;
        let vowelCondition = 'TRUE';
        let includeCondition = 'TRUE';
        let excludeCondition = 'TRUE'
        if(vowels.length){
            vowelCondition = `vowel IN (${vowels.map(()=>'?').join()})`;
        }
        if(patternsInclude.length){
            includeCondition = `(${patternsInclude.map(()=>'line LIKE ?').join(' OR ')})`;
        }
        if(patternsExclude.length){
            excludeCondition = `(${patternsExclude.map(()=>'NOT line LIKE ?').join(' AND ')})`;
        }
        let query = [queryPrefix, vowelCondition, 'AND', includeCondition, 'AND', excludeCondition, querySuffix].join(' ');
        let entry = this.corpusMap.get(corpus);
        if(!entry){
            throw new Error(`Corpus not exist: ${corpus}`);
        }
        let res = await entry.all<QueryResponseBody>(query, ...vowels, ...patternsInclude, ...patternsExclude);
        return res;
    }
}