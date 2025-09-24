import { Pull } from 'zeromq';


export class ZmqPullClient {
    socket = null;
    #connected = false;

    constructor(config) {
        this.config = config;
        this.socket = new Pull();
    }

    async start() {
        if (!this.#connected) {
            await this.socket.connect(this.config.address);
            this.#connected = true;
            console.log(`ZMQ pull client connected to ${this.config.address}`);
        }
    }

    async destroy() {
        if (this.socket && this.#connected) {
            await this.socket.close();
            this.#connected = false;
            console.log('ZMQ pull client socket closed');
        }
    }
}
