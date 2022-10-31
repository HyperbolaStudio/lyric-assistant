import axios from "axios";
import { ListStatus } from "../common/PayloadUtils";
import { getApiHost } from "./getApiHost";
import { logger } from "./logger";

export async function syncCorpusList(){
    let snackbar = logger.snackbar('正在同步词库列表',[],-1,false);
    let url = getApiHost() + '/list';
    try{
        let res = await axios.get(url);
        if(res.status < 400){
            snackbar.close();
            if(res.data.status == ListStatus.OK){
                logger.snackbar('词库同步成功');
                return res.data.body;
            }else{
                throw new Error(res.data.message);
            }
        }else{
            throw new Error(res.statusText);
        }
    }catch(e){
        snackbar.close();
        logger.snackbar(`词库同步失败。刷新页面以重试。${e}`);
    }
}