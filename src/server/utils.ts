import { config, instance } from ".";
import { logger } from "./logger";
import fs from "fs";
import { UserListUtils } from "./UserListUtils";

function randomFactory(){
    let seed = Date.now() & 0x7fffffff;
    return ()=>{
        return seed = ((seed * 214013 + 2531011) >> 16) & 0xff;
    }
};

export const random256 = randomFactory();

namespace Utils {
    export function userAdd(...args: string[]){
        let maxQueries = parseInt(args[0]);
        let userList = UserListUtils.getUserList();
        if(!config.authority || !userList){
            logger.fatal('No user list specified in configuration.');
            process.exit(1);
        }
        let filePath = config.authority.user_list;
        let newAccessKey = '';
        for(let i = 0; i <= 7; i++){
            let seg = random256().toString(16);
            if(seg.length == 1)seg = '0'+seg;
            newAccessKey += seg;
        }
        let list = Object.entries(userList).map(([accessKey, userInfo])=>({
            accessKey,
            userInfo,
        }));
        list.push({
            accessKey: newAccessKey,
            userInfo: {
                maxQueries
            }
        });
        fs.writeFileSync(filePath, JSON.stringify(list, undefined, 4));
        logger.info(`New user added: %s`, newAccessKey);
    }
    export async function userDel(...args: string[]){
        let matchAccessKey = args[0];
        let userList = UserListUtils.getUserList();
        await instance.readAuth();
        if(!config.authority || !userList || !instance.authDatabase){
            logger.fatal('No user list specified in configuration.');
            process.exit(1);
        }
        let filePath = config.authority.user_list;
        let list = Object.entries(userList)
            .filter(([accessKey])=>accessKey!=matchAccessKey)
            .map(([accessKey, userInfo])=>({
                accessKey,
                userInfo,
            }));
        fs.writeFileSync(filePath, JSON.stringify(list, undefined, 4));
        await instance.authDatabase.run(
            `DELETE FROM auth WHERE access_key=?`,
            matchAccessKey
        );
        logger.info(`User removed: %s`, matchAccessKey);
    }
    export function userMod(...args: string[]){
        let matchAccessKey = args[0];
        let maxQueries = parseInt(args[1]);
        let userList = UserListUtils.getUserList();
        if(!config.authority || !userList){
            logger.fatal('No user list specified in configuration.');
            process.exit(1);
        }
        let filePath = config.authority.user_list;
        let list = Object.entries(userList)
            .map(([accessKey, userInfo])=>({
                accessKey,
                userInfo: accessKey == matchAccessKey ? {maxQueries} : userInfo,
            }));
        fs.writeFileSync(filePath, JSON.stringify(list, undefined, 4));
        logger.info(`User info modified: %s %d`, matchAccessKey, maxQueries);
    }
}

export default Utils;