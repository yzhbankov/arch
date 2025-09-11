import {Pull} from 'zeromq';
import EventEmitter from 'events';


export interface IZmqPullClient extends EventEmitter {
    start(): Promise<void>;
    destroy(): void;
    socket: Pull
}

type ZmqConfigType = {
    address: string;
    log: boolean;
}

export class ZmqPullClient extends EventEmitter implements IZmqPullClient {
    socket: Pull;
    config: ZmqConfigType;

    constructor(config: ZmqConfigType) {
        super();
        this.config = config;
        this.socket = new Pull();
        this.socket.connect(config.address);
        console.log(`ZMQ pull client connected to address: ${config.address}`);
    }

    async start(): Promise<void> {
        console.log('ZMQ pull client start');
        for await (const [msg] of this.socket) {
            if (this.config.log) {
                console.log('PULL:', msg.toString());
            }
            this.emit('message', msg.toString());
        }
    }

    destroy(): void {
        this.socket.close();
        console.log('ZMQ pull client closed');
    }
}
