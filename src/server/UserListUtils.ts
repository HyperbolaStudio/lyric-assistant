import Ajv from "ajv";
import fs from "fs";
import { config } from ".";
import { logger } from "./logger";
import * as userListSchema from "../schema/user_list.json";
const ajv = new Ajv();

export namespace UserListUtils {
    export interface UserData {
        accessKey: string,
        userInfo: UserInfo,
    }
    export interface UserInfo {
        maxQueries: number,
    }
    export function getUserList(){
        if(config.authority){
            try{
                let userListArray = JSON.parse(fs.readFileSync(config.authority.user_list).toString());
                if(!ajv.compile<UserData[]>(userListSchema)(userListArray)){
                    throw new Error(`Invalid user list schema. See documentation for details`);
                }
                let userList: Record<string, UserInfo> = {};
                userListArray.forEach(userData=>{
                    userList[userData.accessKey] = userData.userInfo;
                });
                return userList;
            }catch(e: any){
                logger.fatal(`Unable to read user list.\n${e.stack ?? e}`);
                process.exit(1);
            }
        }else{
            return undefined;
        }
    }
}