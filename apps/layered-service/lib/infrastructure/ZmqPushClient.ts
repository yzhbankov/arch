import {Push} from 'zeromq';

export interface IZmqPushClient {
    send(message: string): Promise<void>
    client: Push
}

type ZmqConfigType = {
    address: string;
    log: boolean;
}

export class ZmqPushClient implements IZmqPushClient {
    client: Push;
    config: ZmqConfigType;

    constructor(config: ZmqConfigType) {
        this.config = config;
        this.client = new Push();
        this.client.connect(config.address);
        console.log(`ZMQ push client connect to: ${config.address}`);
    }

    async send(message: string): Promise<void> {
        if (this.config.log) {
            console.log('PUSH:', message);
        }
        await this.client.send(message);
    }
}
