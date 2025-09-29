export default async function handleMessage(message, client) {
    const redisKey = `test:${message.key}`;
    try {
        await client.hGetAll(redisKey);
        await client.del(redisKey);
        await client.hSet(redisKey, ['field1', JSON.stringify(message)]);
    } catch (err) {
        console.error('Redis operation failed:', err);
        return;
    }

    try {
        return { ...message, ts: new Date().toISOString() };
    } catch (err) {
        console.error('Failed to send message via ZMQ socket:', err);
    }
}
