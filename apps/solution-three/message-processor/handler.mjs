export default async function handleMessage(messageRaw, client, socket) {
    let parsedMsg;
    try {
        parsedMsg = typeof messageRaw === 'string' ? JSON.parse(messageRaw) : JSON.parse(messageRaw.toString());
    } catch (err) {
        console.error('Failed to parse message:', err);
        return;
    }

    const redisKey = `test:${parsedMsg.key}`;
    try {
        await client.hGetAll(redisKey);
        await client.del(redisKey);
        await client.hSet(redisKey, ['field1', JSON.stringify(parsedMsg)]);
    } catch (err) {
        console.error('Redis operation failed:', err);
        return;
    }

    try {
        const response = { ...parsedMsg, ts: new Date().toISOString() };
        await socket.send(JSON.stringify(response));
    } catch (err) {
        console.error('Failed to send message via ZMQ socket:', err);
    }
}
