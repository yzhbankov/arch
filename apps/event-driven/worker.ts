import { parentPort } from 'worker_threads';
import { initRedis, saveToRedis, findByKey } from './adapters/storage/redisClient';
import { Push } from 'zeromq';
import { randomUUID } from 'crypto';

// Assign a unique worker UID
const WORKER_UID = randomUUID();
console.log(`Worker started with UID: ${WORKER_UID}`);

const zmqPush = new Push();
zmqPush.connect("tcp://127.0.0.1:7000");
console.log("Worker connected to push socket");

let zmqSendQueue = Promise.resolve(); // serialize sends
let messagesReceived = 0;

initRedis();

parentPort?.on('message', async (msg) => {
    try {
        const processed = {
            key: msg.key,
            ts: new Date().toISOString(),
            randomInt: msg.data.randomInt * 2,
            workerUid: WORKER_UID, // add UID to processed message
        };

        await findByKey(processed.key);
        await saveToRedis(processed.key, JSON.stringify(processed));
        await saveToRedis(processed.key, JSON.stringify(processed));
        await saveToRedis(processed.key, JSON.stringify(processed));

        // Enqueue the ZMQ send operation to a separate promise chain
        zmqSendQueue = zmqSendQueue.then(async () => {
            await zmqPush.send(JSON.stringify(processed));
        });

        // Wait for the ZMQ send to complete before incrementing counter and sending back to parent
        await zmqSendQueue;

        messagesReceived++;

        parentPort?.postMessage({ ok: true });
    } catch (err) {
        console.error(err);
    }
});

// Log messages received every 10 seconds
setInterval(() => {
    console.log(`Worker ${WORKER_UID} processed ${messagesReceived}`);
    messagesReceived = 0;
}, 1000);
