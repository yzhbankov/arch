import { Push } from "zeromq";

const ADDRESS = "tcp://127.0.0.1:7001";

function logStats(counter, totalMessages) {
    console.log(`Messages sent in last 1s: ${counter.value}`);
    console.log(`Total messages sent: ${totalMessages.value}`);
    counter.value = 0;
}

function createMessage() {
    return JSON.stringify({
        key: `00000001A`,
        ts: new Date().toISOString(),
        data: {
            randomInt: Math.floor(Math.random() * 100),
        },
    });
}

async function handleExit(push, totalMessages) {
    console.log(`\nProcess exiting. Total messages sent: ${totalMessages.value}`);
    try {
        await push.close();
    } catch (err) {
        console.error("Error closing Push socket:", err);
    }
    process.exit(0);
}

async function runPublisher() {
    const push = new Push();
    await push.bind(ADDRESS);
    console.log(`Push publisher bound to ${ADDRESS}`);

    const counter = { value: 0 };
    const totalMessages = { value: 0 };
    const BATCH_SIZE = 200;

    setInterval(() => logStats(counter, totalMessages), 1000);

    const exitHandler = () => handleExit(push, totalMessages);
    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);

    let messagesLeft = 20000000;
    while (messagesLeft > 0) {
        const batch = [];
        const currentBatchSize = Math.min(BATCH_SIZE, messagesLeft);
        for (let i = 0; i < currentBatchSize; i++) {
            batch.push(createMessage());
        }
        await push.send(batch);
        counter.value += currentBatchSize;
        totalMessages.value += currentBatchSize;
        messagesLeft -= currentBatchSize;
    }
}

runPublisher().catch(console.error);
