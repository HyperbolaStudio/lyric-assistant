import { readConfig } from './ConfigUtils';
export const config = readConfig();
import { logger } from './logger';
import { Instance } from './Instance';
import { routers } from './routers';
import Utils from './utils';

logger.info('Server started.');

process.on('SIGINT', ()=>{
    logger.info('Server stopped by SIGINT.');
    process.exit(0);
});

process.on('exit', ()=>{
    logger.info('Goodbye!');
});

export const instance = new Instance();

if(process.argv[2]){
    if(Utils.hasOwnProperty(process.argv[2])){
        (Utils as any)[process.argv[2]](...process.argv.slice(3));
    }else{
        logger.fatal(`Invalid util name: %s`, process.argv[2]);
        process.exit(1);
    }
}else{
    (async()=>{
        await instance.init();
        routers(instance.server);
    })();
}

