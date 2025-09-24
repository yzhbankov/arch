import { parentPort } from 'worker_threads';
import { createDbConnection } from './redisConnection.mjs';
import { ZmqPushClient } from './ZmqPushClient.mjs';
import handler from './handler.mjs';
import { randomUUID } from 'crypto';

let dbConnection = null;
let zmqPushClient = null;
let zmqPushStarted = false;
let sendQueue = [];
let sending = false;

const workerUUID = randomUUID();
let counter = 0;

setInterval(() => {
    console.log(`Worker ${workerUUID} received in last 1s: ${counter}`);
    counter = 0;
}, 1000);

async function setupResources() {
    if (!dbConnection) {
        dbConnection = await createDbConnection({
            socket: {
                port: 6379,
                host: '127.0.0.1',
            },
        });
    }
    if (!zmqPushClient) {
        zmqPushClient = new ZmqPushClient({ address: 'tcp://127.0.0.1:7000' });
    }
    if (!zmqPushStarted) {
        await zmqPushClient.start();
        zmqPushStarted = true;
    }
}

async function processSendQueue() {
    if (sending || sendQueue.length === 0) return;
    sending = true;
    const { message, resolve, reject } = sendQueue.shift();
    try {
        await zmqPushClient.socket.send(message);
        resolve();
    } catch (err) {
        reject(err);
    } finally {
        sending = false;
        processSendQueue();
    }
}

async function safeSend(message) {
    return new Promise((resolve, reject) => {
        sendQueue.push({ message, resolve, reject });
        processSendQueue();
    });
}

setupResources().then(() => {
    parentPort?.postMessage({ ready: true });
});

parentPort?.on('message', async (msgList) => {
    try {
        const responses = [];
        for (const singleMsg of msgList) {
            const result = await handler(JSON.parse(singleMsg), dbConnection);
            responses.push(result);
        }
        counter += msgList.length;
        await safeSend(JSON.stringify(responses));
        parentPort?.postMessage({ ok: true });
    } catch (err) {
        console.error('Worker error:', err);
        parentPort?.postMessage({ ok: false, error: err?.message || err });
    }
});
