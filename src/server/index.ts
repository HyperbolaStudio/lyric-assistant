import * as hapi from '@hapi/hapi';
import * as log4js from 'log4js';
import * as fs from 'fs';
import * as path from 'path';
import { readConfig } from './ConfigUtils';
import { routers } from './routers';

export const config = readConfig();

log4js.configure({
    appenders: {
        latest: {
            type: 'file',
            filename: path.join(config.log.dir, 'latest.log'),
            maxLogSize: '1M',
            keepFileExt: true,
            layout: {
                type: 'pattern',
                pattern: '[%d] [%p] [%M]: %m',
            },
        },
        date: {
            type: 'dateFile',
            filename: path.join(config.log.dir, 'logfile.log'),
            pattern: 'yyyy-MM-dd',
            alwaysIncludePattern: true,
            numBackups: 32,
            keepFileExt: true,
            layout: {
                type: 'pattern',
                pattern: '[%d] [%p] [%M]: %m',
            },
        },
        debug: {
            type: "file",
            filename: path.join(config.log.dir, 'debug.log'),
            maxLogSize: '1M',
            keepFileExt: true,
            layout: {
                type: 'pattern',
                pattern: '[%d] [%p] [%M]: %m',
            },
        },
        console: {
            type: "console",
            layout: {
                type: 'pattern',
                pattern: '%[[%d] [%p] [%M]:%] %m',
            },
        }
    },
    categories:{
        default: {
            appenders: ['latest', 'console', 'date', 'debug'],
            level: 'info',
            enableCallStack: true,
        },
        debug: {
            appenders: ['debug'],
            level: 'debug',
            enableCallStack: true,
        }
    }
})

export const logger = log4js.getLogger();
export const debugLogger = log4js.getLogger('debug')

logger.info('Server started.');

export const server = hapi.server({
    port: config.port,
    host: config.host,
});

server.start().then(()=>{
    logger.info(`Http server started at ${server.info.uri}.`);
    routers(server);
}).catch((e)=>{
    logger.fatal(`Unable to start http server. \n${e.stack ?? e}`);
    process.exit(1);
});
