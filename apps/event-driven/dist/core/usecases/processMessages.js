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
exports.processMessage = processMessage;
const redisClient_1 = require("../../adapters/storage/redisClient");
const zmqPushClient_1 = require("../../adapters/messaging/zmqPushClient");
function processMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        // Example transformation
        const processed = {
            key: msg.key,
            ts: new Date().toISOString(),
            randomInt: msg.data.randomInt * 2,
        };
        yield (0, redisClient_1.saveToRedis)(processed.key, processed);
        yield (0, zmqPushClient_1.sendMessage)(processed);
    });
}
