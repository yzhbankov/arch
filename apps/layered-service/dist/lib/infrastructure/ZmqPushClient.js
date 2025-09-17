"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmqPushClient = void 0;
const zeromq_1 = require("zeromq");
class ZmqPushClient {
    constructor(config) {
        this.queue = [];
        this.sending = false;
        this.config = config;
        this.client = new zeromq_1.Push();
        this.client.connect(config.address);
        console.log(`ZMQ push client bind ${config.address}`);
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.push(message);
            if (!this.sending) {
                this.sending = true;
                while (this.queue.length > 0) {
                    const msg = this.queue.shift();
                    try {
                        yield this.client.send(msg);
                        if (this.config.log)
                            console.log(`Sent message: ${msg}`);
                    }
                    catch (err) {
                        console.error('Failed to send message:', err);
                    }
                }
                this.sending = false;
            }
        });
    }
}
exports.ZmqPushClient = ZmqPushClient;
