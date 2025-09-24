import { Push } from 'zeromq';


export class ZmqPushClient {
    socket = null;
    #connected = false;

    constructor(config) {
        this.config = config;
        this.socket = new Push();
    }

    async start() {
        if (!this.#connected) {
            await this.socket.connect(this.config.address);
            this.#connected = true;
            console.log(`ZMQ push client connected to ${this.config.address}`);
        }
    }

    async destroy() {
        if (this.socket && this.#connected) {
            await this.socket.close();
            this.#connected = false;
            console.log('ZMQ push client socket closed');
        }
    }
}
