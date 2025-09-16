import { Pull } from "zeromq";

async function runConsumer() {
    const pull = new Pull();
    const address = "tcp://127.0.0.1:7000";
    await pull.bind(address);
    console.log(`Pull consumer bind ${address}`);

    let counter = 0;
    let totalMessages = 0;

    // Log messages per 1 second
    setInterval(() => {
        console.log(`Messages received in last 1s: ${counter}`);
        console.log(`Total messages received: ${totalMessages}`);
        counter = 0; // reset counter after logging
    }, 1000);

    // Handle process termination
    const handleExit = () => {
        console.log(`\nProcess exiting. Total messages pulled: ${totalMessages}`);
        process.exit(0);
    };
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);

    for await (const [msg] of pull) {
        try {
            const parsed = JSON.parse(msg.toString());
            counter++;
            totalMessages++;
        } catch (err) {
            console.error("Failed to parse message:", err);
        }
    }
}

runConsumer().catch(console.error);
