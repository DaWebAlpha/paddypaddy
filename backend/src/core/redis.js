/*
|--------------------------------------------------------------------------
| REDIS CONNECTION LAYER
|--------------------------------------------------------------------------
|
| Establishes and monitors the Redis connection used for caching,
| session storage, rate limiting, and token management.
|
*/

import Redis from 'ioredis';
import config from '../config/config.js';
import { system_logger } from './pino.logger.js';

const REDIS_URI = config.redis_uri;

/*
|--------------------------------------------------------------------------
| REDIS CLIENT INSTANCE
|--------------------------------------------------------------------------
|
| A single Redis client instance is created and reused across the
| entire application to benefit from connection pooling and
| efficient TCP resource usage.
|
*/
const redis = new Redis(REDIS_URI);


/*
|--------------------------------------------------------------------------
| CONNECTION EVENTS
|--------------------------------------------------------------------------
|
| These listeners allow the system to monitor Redis health and
| provide observability through the centralized logger.
|
*/

redis.on('connect', () => {
    system_logger.info('Redis TCP connection established');
});

redis.on('ready', () => {
    system_logger.info('Redis client is ready for commands');
});

redis.on('error', (error) => {
    system_logger.error({ err: error }, 'Redis connection error');
});

redis.on('close', () => {
    system_logger.warn('Redis connection closed');
});


export default redis;