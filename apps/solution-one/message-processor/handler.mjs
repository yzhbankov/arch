/**
 * Handles a message: parses, updates Redis, and sends a response.
 * @param {string|Buffer} messageRaw - The raw message from ZMQ.
 * @param {object} client - Redis client instance.
 * @param {object} socket - ZMQ socket instance.
 */
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
