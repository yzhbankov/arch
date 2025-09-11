import {Repository} from './lib/repository';
import {createDbConnection} from './lib/db';
import {ZmqPullClient, ZmqPushClient} from './lib/infrastructure';
import * as ZmqApi from './lib/api/zmqApi';
import * as ConfigContainer from './lib/config';
import ModelBase from './lib/models/ModelBase';

export async function main() {
    const zmqPushClient = new ZmqPushClient({address: ConfigContainer.config.zmq.pushAddress, log: ConfigContainer.config.zmq.log});
    const zmqPullClient = new ZmqPullClient({address: ConfigContainer.config.zmq.pullAddress, log: ConfigContainer.config.zmq.log});

    const dbConnection = await createDbConnection({
        socket: {
            port: ConfigContainer.config.db.port,
            host: ConfigContainer.config.db.host,
        },
    });

    // Init Domain Model Layer
    ModelBase.setRepository(new Repository({
        repositoryInstance: dbConnection,
        prefix: ConfigContainer.config.db.prefix,
    }));

    // Init Service Layer
    ModelBase.setZmqPushClient(zmqPushClient);

    // Init Controllers Layer (API)
    ZmqApi.startServer({
        serverPort: ConfigContainer.config.serverPort,
        zmqPullClient
    });

    // Add Global Unhandled Errors Handlers
    async function exit() {
        await ZmqApi.stopServer();
        zmqPullClient.destroy();
        console.log('[rtls-asset-tracking-message-processor] Exit');
        process.exit(0);
    }

    process.on('SIGTERM', async () => {
        console.error('[rtls-asset-tracking-message-processor] SIGTERM signal caught');
        await exit();
    });

    process.on('SIGINT', async () => {
        console.error('[rtls-asset-tracking-message-processor] SIGINT signal caught');
        await exit();
    });

    process.on('unhandledRejection', (error: Error) => {
        console.error('[rtls-asset-tracking-message-processor] unhandledRejection', error.stack);
    });

    process.on('uncaughtException', (error: Error) => {
        console.error('[rtls-asset-tracking-message-processor] uncaughtException', error.stack);
    });
}
