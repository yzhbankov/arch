import { Pull } from "zeromq";

const ADDRESS = "tcp://127.0.0.1:7000";

function logStats(counter, totalMessages) {
    console.log(`Messages received in last 1s: ${counter.value}`);
    console.log(`Total messages received: ${totalMessages.value}`);
    counter.value = 0;
}

async function handleExit(pull, totalMessages) {
    console.log(`\nProcess exiting. Total messages received: ${totalMessages.value}`);
    try {
        await pull.close();
    } catch (err) {
        console.error("Error closing Pull socket:", err);
    }
    process.exit(0);
}

async function runConsumer() {
    const pull = new Pull();
    await pull.bind(ADDRESS);
    console.log(`Pull consumer bound to ${ADDRESS}`);

    const counter = { value: 0 };
    const totalMessages = { value: 0 };

    setInterval(() => logStats(counter, totalMessages), 1000);

    const exitHandler = () => handleExit(pull, totalMessages);
    process.on("SIGINT", exitHandler);
    process.on("SIGTERM", exitHandler);

    for await (const msg of pull) {
        try {
            JSON.parse(msg.toString());
            counter.value += 1;
            totalMessages.value += 1;
        } catch (err) {
            console.error("Failed to parse batch:", err);
        }
    }
}

runConsumer().catch(console.error);
