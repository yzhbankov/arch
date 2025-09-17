"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelBase {
    constructor() {
        this.repository = ModelBase.repositoryInstance;
        this.zmqPushClient = ModelBase.zmqClientInstance;
    }
    static setRepository(repository) {
        if (!repository) {
            throw new Error('Invalid Repository provided.');
        }
        ModelBase.repositoryInstance = repository;
    }
    static setZmqPushClient(zmqPushClient) {
        if (!zmqPushClient) {
            throw new Error('Invalid ZmqClient provided.');
        }
        ModelBase.zmqClientInstance = zmqPushClient;
    }
}
ModelBase.repositoryInstance = null;
ModelBase.zmqClientInstance = null;
exports.default = ModelBase;
