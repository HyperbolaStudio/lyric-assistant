import { QueryRequest, QueryResponse, QueryResponseBody, QueryResponseStatus } from "../common/PayloadUtils";
import axios from 'axios';
import { apiHost } from ".";
import { queryRequestValidate } from "./queryResponseValidate";

export function invokeQuery(query: QueryRequest){
    // let rawRes = await(axios.post(path.join(apiHost, 'query'), query));
    // if(!queryRequestValidate(rawRes.data)){
    //     throw new Error(`Format: Invalid response format.`);
    // }
    // if(rawRes.data.status != QueryResponseStatus.OK){
    //     throw new Error(`${QueryResponseStatus[rawRes.data.status]}: ${rawRes.data.message}`);
    // }
    // let res = rawRes.data.body;

    return new Promise<QueryResponseBody[]>((resolve,reject)=>{
        let times = query.queryNumber;
        let res: QueryResponseBody[] = [];
        for(let i = 0; i < times; i++){
            res.push({
                line: `${i}测试`,
                pinyin: 'ce,shi',
                vowel: '-i',
                title: '测试标题',
                author: 'test',
                id: 473740870,
            });
        }
        setTimeout(()=>resolve(res), 1000);
    });
}