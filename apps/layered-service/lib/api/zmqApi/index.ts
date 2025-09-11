import http from 'http';
import {IZmqPullClient} from '../../infrastructure';
import controller from './controller';

let server: http.Server | null = null;

export function startServer({serverPort, zmqPullClient}: { serverPort: number, zmqPullClient: IZmqPullClient }): void {
    // Http Server is using with the tests purposes
    server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('{}');
    });

    server.listen(serverPort, async () => {
        console.log('Server listening on port:', serverPort);
        zmqPullClient.on('message', controller);
        zmqPullClient.on('error', (error) => {
            console.error('Zmq Pull Client Error', error);
        });
        await zmqPullClient.start();
    });
}

export async function stopServer(): Promise<void> {
    if (!server) {
        console.log('Server is not running');
        return;
    }

    server.close(() => {
        console.log('Server stopped');
    });
}
