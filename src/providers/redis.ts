import config from '@/configs/main';
import Redis from 'ioredis';

export const redis = new Redis(config.redis.url);
