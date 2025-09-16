import {createClient, RedisClientType} from '@redis/client';
import {RedisModules, RedisFunctions, RedisScripts} from '@redis/client';

export let redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

export async function initRedis() {
    redisClient = createClient({ socket: { host: '127.0.0.1', port: 6379 } });
    redisClient.on('error', console.error);
    await redisClient.connect();
    console.log('Redis client connected');
}

export async function saveToRedis(key: string, value: string) {
    await redisClient.del(`test:${key}`);
    await redisClient.hSet(`test:${key}`, ['field1', value]);
}

export async function findByKey(key: string) {
    return redisClient.hGetAll(`test:${key}`);
}
