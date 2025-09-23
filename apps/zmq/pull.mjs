import { Pull } from "zeromq";

async function runConsumer() {
    const pull = new Pull();
    const address = "tcp://127.0.0.1:7000";
    await pull.bind(address);
    console.log(`Pull consumer bound to ${address}`);

    let counter = 0;
    let totalMessages = 0;
    const startTime = Date.now(); // track start time

    // Log messages per 1 second
    setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const averagePerSecond = totalMessages / elapsedSeconds;

        console.log(`Messages received in last 1s: ${counter}`);
        console.log(`Total messages received: ${totalMessages}`);
        console.log(`Average messages/sec: ${averagePerSecond.toFixed(0)}`);

        counter = 0; // reset counter after logging
    }, 1000);

    // Handle process termination
    const handleExit = () => {
        process.exit(0);
    };
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);

    // Consume messages in batches
    for await (const msgParts of pull) {
        try {
            const batch = msgParts.map((b) => JSON.parse(b.toString()));

            counter += batch.length;
            totalMessages += batch.length;

        } catch (err) {
            console.error("Failed to parse batch:", err);
        }
    }
}

runConsumer().catch(console.error);
