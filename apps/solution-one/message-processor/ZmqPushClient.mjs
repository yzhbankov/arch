import { Push } from 'zeromq';


export class ZmqPushClient {
    socket = null;

    constructor(config) {
        this.config = config;
        this.socket = new Push();
        this.socket.connect(config.address);
        console.log(`ZMQ push client connected to ${config.address}`);
    }
}
