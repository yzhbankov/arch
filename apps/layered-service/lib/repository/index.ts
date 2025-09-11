import {RedisClientType, RedisFunctions, RedisModules, RedisScripts} from '@redis/client';

type RedisType = RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

type RepoOptionsType = {
    repositoryInstance: RedisType;
    prefix: string;
};

export interface IEntityDocument {
    repoInstance: RedisType;
    findByKey(key: string): Promise<string | null>;
    save(key: string, value: string): Promise<string | null>;
}

export class EntityDocument implements IEntityDocument {
    repoInstance: RedisType;
    prefix: string;

    constructor(options: RepoOptionsType) {
        const { repositoryInstance, prefix } = options;
        this.repoInstance = repositoryInstance;
        this.prefix = prefix;
    }

    async findByKey(key: string): Promise<string | null> {
        try {
            const result = await this.repoInstance.hGetAll(`${this.prefix}:entity:${key}`);

            if (!result || Object.keys(result).length === 0) {
                return null;
            }

            // Return the first value (or adjust to return a specific field)
            return Object.values(result)[0] ?? null;
        } catch (e: unknown) {
            console.error('Redis error in findByKey:', e);
            return null;
        }
    }

    async save(key: string, value: string): Promise<string|null> {
        try {
            await this.repoInstance.del(`${this.prefix}:entity:${key}`);
            await this.repoInstance.hSet(`${this.prefix}:entity:${key}`, [value]);

            return value
        } catch (e: unknown) {
            return null;
        }
    }
}

export interface IRepository {
    entity: IEntityDocument;
}

export class Repository implements IRepository {
    public entity: IEntityDocument;

    constructor(options: RepoOptionsType) {
        this.entity = new EntityDocument(options);
    }
}
