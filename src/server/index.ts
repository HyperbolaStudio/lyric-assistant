import { readConfig } from './ConfigUtils';
export const config = readConfig();
import { logger } from './logger';
import { Instance } from './Instance';
import { routers } from './routers';

logger.info('Server started.');

process.on('SIGINT', ()=>{
    logger.info('Server stopped by SIGINT.');
    process.exit(0);
});

process.on('exit', ()=>{
    logger.info('Goodbye!');
});

export const instance = new Instance();

(async()=>{
    await instance.init();
    routers(instance.server);
})();