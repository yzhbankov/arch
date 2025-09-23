// zmq-push-publisher.ts
import { Push } from "zeromq";

async function runPublisher() {
    const push = new Push();
    const address = "tcp://127.0.0.1:7001";
    await push.bind(address);
    console.log(`Push publisher bind ${address}`);

    let counter = 0;
    let totalMessages = 0;
    const BATCH_SIZE = 5; // number of messages per batch

    // Log messages per 1 second
    setInterval(() => {
        console.log(`Messages sent in last 1s: ${counter}`);
        console.log(`Total messages sent: ${totalMessages}`);
        counter = 0;
    }, 1000);

    // Handle process termination
    const handleExit = async () => {
        console.log(`\nProcess exiting. Total messages sent: ${totalMessages}`);
        try {
            await push.close();
        } catch (err) {
            console.error("Error closing Push socket:", err);
        }
        process.exit(0);
    };
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);

    while (true) {
        const batch = [];

        for (let i = 0; i < BATCH_SIZE; i++) {
            const msg = {
                key: `00000001A`,
                ts: new Date().toISOString(),
                data: {
                    randomInt: Math.floor(Math.random() * 100),
                },
            };
            batch.push(JSON.stringify(msg));
        }

        // Send batch as a single multipart message
        await push.send(batch.map(m => `~entity${m}`));
        counter += BATCH_SIZE;
        totalMessages += BATCH_SIZE;
    }
}

runPublisher().catch(console.error);
