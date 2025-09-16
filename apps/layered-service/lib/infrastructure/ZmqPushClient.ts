import { Push } from 'zeromq';

export interface IZmqPushClient {
    send(message: string): Promise<void>;
    client: Push;
}

type ZmqConfigType = {
    address: string;
    log: boolean;
};

export class ZmqPushClient implements IZmqPushClient {
    client: Push;
    config: ZmqConfigType;

    private queue: string[] = [];
    private sending = false;

    constructor(config: ZmqConfigType) {
        this.config = config;
        this.client = new Push();
        this.client.bindSync(config.address);
        console.log(`ZMQ push client bind ${config.address}`);
    }

    async send(message: string): Promise<void> {
        this.queue.push(message);

        if (!this.sending) {
            this.sending = true;
            while (this.queue.length > 0) {
                const msg = this.queue.shift()!;
                try {
                    await this.client.send(msg);
                    if (this.config.log) console.log(`Sent message: ${msg}`);
                } catch (err) {
                    console.error('Failed to send message:', err);
                }
            }
            this.sending = false;
        }
    }
}
