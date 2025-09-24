export default async function (messageRaw, client, socket) {
    const parsedMsg = JSON.parse(messageRaw);

    await client.hGetAll(`test:${parsedMsg.key}`);
    await client.del(`test:${parsedMsg.key}`);
    await client.hSet(`test:${parsedMsg.key}`, ['field1', JSON.stringify(parsedMsg)]);

    await socket.send(JSON.stringify({...parsedMsg, ts: new Date().toISOString()}));
}
