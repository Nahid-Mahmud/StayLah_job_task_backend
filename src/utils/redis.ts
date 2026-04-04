import ioredis from 'ioredis';
import envVariables from '../app/config/env';

export const redisConnection = new ioredis({
  host: envVariables.REDIS_HOST,
  port: Number(envVariables.REDIS_PORT),
  maxRetriesPerRequest: null,
});
