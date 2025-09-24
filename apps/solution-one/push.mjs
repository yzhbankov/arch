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
    await push.connect(ADDRESS);
    console.log(`Push publisher bind ${ADDRESS}`);

    const counter = { value: 0 };
    const totalMessages = { value: 0 };

    setInterval(() => logStats(counter, totalMessages), 1000);

    const exitHandler = () => handleExit(push, totalMessages);
    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);

    while (totalMessages.value < 1000000) {
        await push.send(createMessage());
        counter.value += 1;
        totalMessages.value += 1;
    }
}

runPublisher().catch(console.error);
