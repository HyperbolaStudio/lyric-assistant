import * as fs from 'fs';
import Ajv from 'ajv';
import * as configSchema from '../schema/config.json';
const ajv = new Ajv();

export interface Corpus{
    name: string,
    label: string,
    path: string,
}

export interface Config{
    port?: number,
    host?: string,
    corpus: Corpus[],
    authority?: {
        user_list: string,
        db: string,
    }
    log: {
        dir: string,
    }
}

export function readConfig(){
    try{
        let config = JSON.parse(fs.readFileSync('server_config.json').toString());
        if(!ajv.compile<Config>(configSchema)(config)){
            throw new Error(`Invalid config schema. See documentation for details`);
        }
        return config;
    }catch(e: any){
        console.error(`FATAL: Unable to read configuration. \n${e.stack ?? e}`);
        process.exit(1);
    }
}

