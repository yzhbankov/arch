import {createDbConnection} from './redisConnection.mjs';
import {ZmqPullClient} from './ZmqPullClient.mjs';
import {ZmqPushClient} from './ZmqPushClient.mjs';
import handler from './handler.mjs';

export async function main() {
    const zmqPushClient = new ZmqPushClient({address: 'tcp://127.0.0.1:7000'});
    const zmqPullClient = new ZmqPullClient({address: 'tcp://127.0.0.1:7001'});

    const dbConnection = await createDbConnection({
        socket: {
            port: 6379,
            host: '127.0.0.1',
        },
    });

    for await (const [msg] of zmqPullClient.socket) {
        try {
            await handler(msg, dbConnection, zmqPushClient.socket);
        } catch (err) {
            console.error('Handler failed:', err);
        }
    }

    // 🚀 Start listening for messages
    zmqPullClient.start().catch((err) => {
        console.error('ZMQ Pull failed to start:', err);
    });

    // Add Global Unhandled Errors Handlers
    async function exit() {
        zmqPullClient.destroy();
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
        console.error('unhandledRejection', error.stack);
    });

    process.on('uncaughtException', (error) => {
        console.error('uncaughtException', error.stack);
    });
}

main()
