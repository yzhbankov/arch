import {createClient, RedisClientOptions, RedisClientType} from '@redis/client';
import {RedisModules, RedisFunctions, RedisScripts} from '@redis/client';

export async function createDbConnection(
    options: RedisClientOptions,
): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>> {
    const client = createClient(options);
    await client.connect();
    console.log('Redis client initialized with options', options);

    client.on('error', function (error) {
        console.error(error);
    });
    return client;
}
