import {createClient} from '@redis/client';

export async function createDbConnection(options) {
    const client = createClient(options);
    await client.connect();

    client.on('error', function (error) {
        console.error(error);
    });
    return client;
}
