import {IRepository} from '../repository';
import {IZmqPushClient} from '../infrastructure';

export interface IModelBase {
    repository: IRepository | null;
}

export default class ModelBase implements IModelBase {
    public repository: IRepository | null;
    public zmqPushClient: IZmqPushClient | null;

    constructor() {
        this.repository = ModelBase.repositoryInstance;
        this.zmqPushClient = ModelBase.zmqClientInstance;
    }

    static repositoryInstance: IRepository | null = null;

    static zmqClientInstance: IZmqPushClient | null = null;


    static setRepository(repository: IRepository) {
        if (!repository) {
            throw new Error('Invalid Repository provided.');
        }
        ModelBase.repositoryInstance = repository;
    }

    static setZmqPushClient(zmqPushClient: IZmqPushClient) {
        if (!zmqPushClient) {
            throw new Error('Invalid ZmqClient provided.');
        }
        ModelBase.zmqClientInstance = zmqPushClient;
    }
}
