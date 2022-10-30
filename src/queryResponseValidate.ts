import { QueryResponse, QueryResponseStatus } from "./declarations";

export function queryRequestValidate(data: any): data is QueryResponse{
    if(!data)return false;
    if(typeof(data.status)!='number')return false;
    if(!(data.status in QueryResponseStatus))return false;
    if(data.status == QueryResponseStatus.OK){
        if(!data.body)return false;
        if(!data.body[0])return false;
        if(typeof(data.body[0].line) != 'string')return false;
        if(typeof(data.body[0].pinyin) != 'string')return false;
        if(typeof(data.body[0].vowel) != 'string')return false;
        if(typeof(data.body[0].title) != 'string')return false;
        if(typeof(data.body[0].author) != 'string' && typeof(data.body[0].id) != 'number')return false;
    }else{
        if(typeof(data.message) != 'string')return false;
    }
    return true;
}