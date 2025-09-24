import { Pull } from 'zeromq';


export class ZmqPullClient {
    socket = null;
    #bound = false;

    constructor(config) {
        this.config = config;
        this.socket = new Pull();
    }

    async start() {
        if (!this.#bound) {
            await this.socket.bind(this.config.address);
            this.#bound = true;
            console.log(`ZMQ pull client bound to ${this.config.address}`);
        }
    }

    async destroy() {
        if (this.socket && this.#bound) {
            await this.socket.close();
            this.#bound = false;
            console.log('ZMQ pull client socket closed');
        }
    }
}
