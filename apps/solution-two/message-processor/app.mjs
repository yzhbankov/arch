import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { ZmqPullClient } from './ZmqPullClient.mjs';


export async function main() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let worker;

    const zmqPullClient = new ZmqPullClient({ address: 'tcp://127.0.0.1:7001' });
    await zmqPullClient.start();

    // Track worker readiness
    await new Promise((resolve) => {
        worker = new Worker(path.resolve(__dirname, 'worker.mjs'));
        worker.on('message', (msg) => {
            if (msg && msg.ready) {
                resolve();
            }
        });
    });

    for await (const [msg] of zmqPullClient.socket) {
        worker.postMessage(msg.toString());
    }
}

main();
