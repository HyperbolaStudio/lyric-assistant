import { QueryRequest, QueryResponse, QueryResponseBody, QueryResponseStatus } from "../common/PayloadUtils";
import axios from 'axios';
import { apiHost } from ".";
import { queryRequestValidate } from "./queryResponseValidate";
import { getApiHost } from "./getApiHost";

export async function invokeQuery(query: QueryRequest){
    let rawRes = await(axios.post(getApiHost()+'/query', query));
    if(rawRes.data.status != QueryResponseStatus.OK){
        throw new Error(`${QueryResponseStatus[rawRes.data.status]}: ${rawRes.data.message}`);
    }
    return rawRes.data.body as QueryResponseBody[];
}