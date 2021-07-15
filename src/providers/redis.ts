import config from '@/config/main';
import Redis from 'ioredis';

export const redis = new Redis(config.redis.url);
