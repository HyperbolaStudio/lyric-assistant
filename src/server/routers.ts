import { Server } from "@hapi/hapi";
import { config, debugLogger, logger } from ".";
import { ListStatus } from "../common/PayloadUtils";

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
        handler: (request,h)=>{
            debugLogger.debug(`Request: %s %s %s`, request.info.id, request.path, request.headers['X-Forwarded-For'] || request.info.remoteAddress);

        }
    });
}