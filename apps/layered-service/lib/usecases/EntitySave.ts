import {Entities} from '../models';
import {UseCaseBase, IUseCase} from './UseCaseBase';

export type UplinkDataType = {
    key: string
    ts: string
    data: {
        randomInt: number
    }
}

export class EntitySave extends UseCaseBase implements IUseCase {
    async execute(params: UplinkDataType): Promise<null> {
        const entityModel = new Entities();
        const entity = await entityModel.findByKey(params.key);
        await entityModel.save(params.key, JSON.stringify(params));
        await entityModel.send({...params, ts: new Date().toISOString()});
        return null;
    }
}
