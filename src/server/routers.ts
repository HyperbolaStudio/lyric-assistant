import { Server } from "@hapi/hapi";
import Ajv from "ajv";
import { config, instance } from ".";
import { ListStatus, QueryRequest, QueryResponseStatus } from "../common/PayloadUtils";
import { logger, debugLogger } from "./logger";
const ajv = new Ajv();
import * as queryRequestSchema from "../schema/queryRequest.json";
import { patternizeWords } from "./patternizeWords";

export function routers(server: Server){

    logger.info(`Routing rule: /list`);
    server.route({
        method: 'GET',
        path: '/list',
        options: {
            cors: {
                origin: ['*']
            }
        },
        handler: (request, h)=>{
            try{
                debugLogger.debug(`Request: %s %s %s`, request.info.id, request.path, request.headers['X-Forwarded-For'] || request.info.remoteAddress);
                return {
                    status: ListStatus.OK,
                    body: config.corpus.map(v=>({
                        name: v.name,
                        label: v.label,
                    })),
                }
            }catch(e: any){
                logger.error(`An internal server error occurred. Request ${request.info.id}.\n ${e.stack ?? e}`);
                return {
                    status: ListStatus.ServerError,
                    message: 'An internal server error occurred.',
                }
            }
        }
    });

    logger.info(`Routing rule: /query`);
    server.route({
        method: 'POST',
        path: '/query',
        options: {
            cors: {
                origin: ['*']
            }
        },
        handler: async (request,h)=>{
            debugLogger.debug(`Request: %s %s %s`, request.info.id, request.path, request.headers['X-Forwarded-For'] || request.info.remoteAddress);
            try{
                let query = request.payload;
                if(!ajv.compile<QueryRequest>(queryRequestSchema)(query)) return {
                    status: QueryResponseStatus.FormatError,
                    message: 'Request format error.',
                }
                if(!instance.hasUser(query.accessKey)) return {
                    status: QueryResponseStatus.PermissionDenied,
                    message: 'Permission denied',
                }
                let queryNumber = await instance.getQueryNumbers(query.accessKey);
                if(!await instance.updateUserQuery(query.accessKey)) return {
                    status: QueryResponseStatus.QueryNumberLimitExceeded,
                    message: `Query number limit exceeded. Total ${queryNumber.total}, available ${queryNumber.available}, but queried ${query.queryNumber}.`,
                }
                if(!(query.library in instance.corpusMap)) return {
                    status: QueryResponseStatus.CorpusLibraryNotExist,
                    message: `Queried library ${query.library} does not exist.`,
                }
                return {
                    status: QueryResponseStatus.OK,
                    body: await instance.invokeQuery(
                        query.library,
                        query.vowel,
                        patternizeWords(query.wordInclude, query.wordIncludeMode),
                        patternizeWords(query.wordExclude, query.wordExcludeMode),
                        query.queryNumber,
                    ),
                    queryNumber
                }
            }catch(e: any){
                logger.error(`An internal server error occurred. Request ${request.info.id}.\n ${e.stack ?? e}`);
                return {
                    status: QueryResponseStatus.ServerError,
                    message: 'An internal server error occurred',
                }
            }
        }
    });
}