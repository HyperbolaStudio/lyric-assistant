import { config } from ".";
import * as sqlite from 'sqlite';
import * as sqlite3 from 'sqlite3';
import * as hapi from '@hapi/hapi';
import { UserListUtils } from './UserListUtils';
import { logger } from "./logger";
import { QueryResponseBody, Vowel } from "../common/PayloadUtils";

export class Instance{

    corpusMap: Record<string, sqlite.Database> = {};
    userList?: Record<string, UserListUtils.UserInfo> = {};
    authDatabase?: sqlite.Database;
    server: hapi.Server = hapi.server({
        port: config.port,
        host: config.host,
    });;

    private async connectCorpusDatabase(){
        config.corpus.forEach(async corpus=>{
            try{
                this.corpusMap[corpus.name] =  await sqlite.open({
                    filename: corpus.path,
                    driver: sqlite3.Database,
                });
                logger.info(`Corpus database %s connected.`, corpus.name);
            }catch(e: any){
                logger.fatal(`Unable to connect corpus database %s.\n%s`, corpus.name, e.stack ?? e);
                process.exit(1);
            }
            
        });
    }

    private async readAuth(){
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

    private async startHttpServer(){
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
        if(accessKey in this.userList)return true;
        return false;
    }

    async getQueryNumbers(accessKey: string){
        return {
            total: 10,
            available: 10,
        }
    }

    async updateUserQuery(accessKey: string){
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
        let res = await this.corpusMap[corpus].all<QueryResponseBody>(query, ...vowels, ...patternsInclude, ...patternsExclude);
        return res;
    }
}