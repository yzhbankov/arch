import { Pull } from "zeromq";

async function runConsumer() {
    const pull = new Pull();
    const address = "tcp://127.0.0.1:7000";
    await pull.bind(address);
    console.log(`Pull consumer bound to ${address}`);

    let counter = 0;
    let totalMessages = 0;

    setInterval(() => {
        console.log(`Messages received in last 1s: ${counter}`);
        console.log(`Total messages sent: ${totalMessages}`);
        counter = 0;
    }, 1000);

    const handleExit = () => {
        process.exit(0);
    };
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);

    for await (const msg of pull) {
        try {
            const parsed = JSON.parse(msg.toString());

            counter += 1;
            totalMessages += 1;
        } catch (err) {
            console.error("Failed to parse batch:", err);
        }
    }
}

runConsumer().catch(console.error);
