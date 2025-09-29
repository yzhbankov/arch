import { Push } from "zeromq";

const ADDRESS = "tcp://127.0.0.1:7001";
const BATCH_SIZE = 1;
const MSGS_PER_SECOND = 20000;
const DELAY_NANOSECONDS = BigInt(Math.floor(1e9 / MSGS_PER_SECOND));
const KEY_RANGE = 10000;

const keys = Array.from({ length: KEY_RANGE }, (_, i) =>
    String(i + 1).padStart(8, "0") + "A"
);

function logStats(counter, totalMessages) {
    console.log(`Messages sent in last 1s: ${counter.value}`);
    console.log(`Total messages sent: ${totalMessages.value}`);
    counter.value = 0;
}

console.log(keys);
function createMessage() {
    const key = keys[Math.floor(Math.random() * KEY_RANGE)];
    return JSON.stringify({
        key,
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

    setInterval(() => logStats(counter, totalMessages), 1000);

    const exitHandler = () => handleExit(push, totalMessages);
    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);

    let next = process.hrtime.bigint();
    while (true) {
        const now = process.hrtime.bigint();
        if (now >= next) {
            const batch = BATCH_SIZE > 1 ? Array.from({ length: BATCH_SIZE }, createMessage) : createMessage();
            await push.send(batch);
            counter.value += BATCH_SIZE;
            totalMessages.value += BATCH_SIZE;
            next += DELAY_NANOSECONDS;
        }
    }
}

runPublisher().catch(console.error);
