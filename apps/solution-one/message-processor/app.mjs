import { createDbConnection } from './redisConnection.mjs';
import { ZmqPullClient } from './ZmqPullClient.mjs';
import { ZmqPushClient } from './ZmqPushClient.mjs';
import handler from './handler.mjs';

async function processMessages(zmqPullClient, dbConnection, zmqPushClient) {
    const counter = { value: 0 };
    const totalMessages = { value: 0 };

    setInterval(() => {
        console.log(`Messages received in last 1s: ${counter.value}`);
        console.log(`Total messages received: ${totalMessages.value}`);
        counter.value = 0;
    }, 1000);

    for await (const [msg] of zmqPullClient.socket) {
        try {
            counter.value += 1;
            totalMessages.value += 1;
            await handler(msg, dbConnection, zmqPushClient.socket);
        } catch (err) {
            console.error('Handler failed:', err);
        }
    }
}

function setupProcessHandlers(zmqPullClient) {
    async function exit() {
        await zmqPullClient.destroy();
        console.log('Exit');
        process.exit(0);
    }

    process.on('SIGTERM', async () => {
        console.error('SIGTERM signal caught');
        await exit();
    });

    process.on('SIGINT', async () => {
        console.error('SIGINT signal caught');
        await exit();
    });

    process.on('unhandledRejection', (error) => {
        console.error('unhandledRejection', error && error.stack ? error.stack : error);
    });

    process.on('uncaughtException', (error) => {
        console.error('uncaughtException', error && error.stack ? error.stack : error);
    });
}

export async function main() {
    const zmqPushClient = new ZmqPushClient({ address: 'tcp://127.0.0.1:7000' });
    const zmqPullClient = new ZmqPullClient({ address: 'tcp://127.0.0.1:7001' });

    await zmqPushClient.start();
    await zmqPullClient.start();

    const dbConnection = await createDbConnection({
        socket: {
            port: 6379,
            host: '127.0.0.1',
        },
    });

    setupProcessHandlers(zmqPullClient);

    zmqPullClient.start().catch((err) => {
        console.error('ZMQ Pull failed to start:', err);
    });

    await processMessages(zmqPullClient, dbConnection, zmqPushClient);
}

main();
