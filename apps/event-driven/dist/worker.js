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
const worker_threads_1 = require("worker_threads");
const redisClient_1 = require("./adapters/storage/redisClient");
const zeromq_1 = require("zeromq");
const crypto_1 = require("crypto");
// Assign a unique worker UID
const WORKER_UID = (0, crypto_1.randomUUID)();
console.log(`Worker started with UID: ${WORKER_UID}`);
const zmqPush = new zeromq_1.Push();
zmqPush.connect("tcp://127.0.0.1:7000");
console.log("Worker connected to push socket");
let zmqSendQueue = Promise.resolve(); // serialize sends
let messagesReceived = 0;
(0, redisClient_1.initRedis)();
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const processed = {
            key: msg.key,
            ts: new Date().toISOString(),
            randomInt: msg.data.randomInt * 2,
            workerUid: WORKER_UID, // add UID to processed message
        };
        yield (0, redisClient_1.findByKey)(processed.key);
        yield (0, redisClient_1.saveToRedis)(processed.key, JSON.stringify(processed));
        yield (0, redisClient_1.saveToRedis)(processed.key, JSON.stringify(processed));
        yield (0, redisClient_1.saveToRedis)(processed.key, JSON.stringify(processed));
        // Enqueue the ZMQ send operation to a separate promise chain
        zmqSendQueue = zmqSendQueue.then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield zmqPush.send(JSON.stringify(processed));
        }));
        // Wait for the ZMQ send to complete before incrementing counter and sending back to parent
        yield zmqSendQueue;
        messagesReceived++;
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ ok: true });
    }
    catch (err) {
        console.error(err);
    }
}));
// Log messages received every 10 seconds
setInterval(() => {
    console.log(`Worker ${WORKER_UID} processed ${messagesReceived}`);
    messagesReceived = 0;
}, 1000);
