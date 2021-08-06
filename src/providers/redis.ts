import Redis from 'ioredis';
import config from '../config/main';

export const redis = new Redis(config.redis.url);
