import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { ZmqPullClient } from './ZmqPullClient.mjs';


const WORKER_COUNT = 2;
const workers = [];
let nextWorker = 0;
let readyWorkers = 0;

function getWorker() {
    const w = workers[nextWorker];
    nextWorker = (nextWorker + 1) % workers.length;
    return w;
}

export async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const zmqPullClient = new ZmqPullClient({ address: 'tcp://127.0.0.1:7001' });
    await zmqPullClient.start();

    // Track worker readiness
    await new Promise((resolve) => {
        for (let i = 0; i < WORKER_COUNT; i++) {
            const worker = new Worker(path.resolve(__dirname, 'worker.mjs'));
            worker.on('message', (msg) => {
                if (msg && msg.ready) {
                    readyWorkers++;
                    if (readyWorkers === WORKER_COUNT) {
                        resolve();
                    }
                }
            });
            workers.push(worker);
        }
    });

    for await (const msg of zmqPullClient.socket) {
        getWorker().postMessage(msg.toString());
    }
}

main();
