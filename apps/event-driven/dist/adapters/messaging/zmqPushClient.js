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
exports.initPush = initPush;
exports.sendMessage = sendMessage;
// adapters/messaging/zmqPushClient.ts
const zeromq_1 = require("zeromq");
const zmqPush = new zeromq_1.Push();
function initPush(address) {
    return __awaiter(this, void 0, void 0, function* () {
        yield zmqPush.bind(address); // async bind!
        console.log(`ZMQ Push connect ${address}`);
    });
}
function sendMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        return zmqPush.send(JSON.stringify(msg));
    });
}
