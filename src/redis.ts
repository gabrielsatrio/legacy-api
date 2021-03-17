import dotenvFlow from 'dotenv-flow';
import Redis from 'ioredis';

dotenvFlow.config();

console.log('>>>>', process.env.REDIS_URL);

export const redis = new Redis(process.env.REDIS_URL);
