import {Pull} from 'zeromq';
import EventEmitter from 'events';


export class ZmqPullClient extends EventEmitter {
    socket = null;

    constructor(config) {
        super();
        this.config = config;
        this.socket = new Pull();
        this.socket.bindSync(config.address);
        console.log(`ZMQ pull client connected to ${config.address}`);
    }
}
