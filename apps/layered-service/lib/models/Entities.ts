import ModelBase, {IModelBase} from './ModelBase';

export class Entities extends ModelBase implements IModelBase {
    constructor() {
        super();
    }

    async findByKey(key: string): Promise<string | null> {
        const entity: string | null | undefined = await this.repository?.entity.findByKey(key);
        if (!entity) {
            return null;
        }
        return entity;
    }

    async save(key: string, value: string): Promise<string | null> {
        const entity: string | null | undefined = await this.repository?.entity.save(key, value);
        if (!entity) {
            return null;
        }
        return entity;
    }
}
