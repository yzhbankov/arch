import path from 'path';
import { Worker } from 'worker_threads';
import { initPull, messages } from './adapters/messaging/zmqPullClient';

const WORKER_COUNT = 4; // adjust to CPU cores
const workers: Worker[] = [];
let nextWorker = 0;

function getWorker(): Worker {
    const w = workers[nextWorker];
    nextWorker = (nextWorker + 1) % workers.length;
    return w;
}

async function main() {
    await initPull('tcp://127.0.0.1:7001');

    // Start workers
    for (let i = 0; i < WORKER_COUNT; i++) {
        // @ts-ignore
        workers.push(new Worker(path.resolve(__dirname, 'worker.js')));
    }

    // Dispatch messages to workers in round-robin
    for await (const msg of messages()) {
        getWorker().postMessage(msg);
    }
}

main().catch(console.error);
