// zmq-push-publisher.ts
import { Push } from "zeromq";

async function runPublisher() {
    const push = new Push();
    const address = "tcp://127.0.0.1:7001";
    await push.connect(address);
    console.log(`Push publisher connected to ${address}`);

    let counter = 0;
    let totalMessages = 0;

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
        const msg = {
            key: `00000001A`,
            ts: new Date().toISOString(),
            data: {
                randomInt: Math.floor(Math.random() * 100),
            },
        };

        await push.send("~entity" + JSON.stringify(msg));
        counter++;
        totalMessages++;
    }
}

runPublisher().catch(console.error);
