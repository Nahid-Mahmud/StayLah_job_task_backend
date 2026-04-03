import ioredis from 'ioredis';
import envVariables from '../app/config/env';

export const redisConnection = new ioredis(envVariables.REDIS_URL, {
  maxRetriesPerRequest: null,
});
