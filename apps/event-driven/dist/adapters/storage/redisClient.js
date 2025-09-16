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
exports.redisClient = void 0;
exports.initRedis = initRedis;
exports.saveToRedis = saveToRedis;
exports.findByKey = findByKey;
const client_1 = require("@redis/client");
function initRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.redisClient = (0, client_1.createClient)({ socket: { host: '127.0.0.1', port: 6379 } });
        exports.redisClient.on('error', console.error);
        yield exports.redisClient.connect();
        console.log('Redis client connected');
    });
}
function saveToRedis(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.del(`test:${key}`);
        yield exports.redisClient.hSet(`test:${key}`, ['field1', value]);
    });
}
function findByKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return exports.redisClient.hGetAll(`test:${key}`);
    });
}
