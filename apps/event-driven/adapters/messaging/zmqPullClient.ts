import { Pull } from "zeromq";

export const zmqPull = new Pull();

export async function initPull(address: string) {
    zmqPull.connect(address);
    console.log(`ZMQ Pull connected to ${address}`);
}

function parseSafeNull(string: string | null): Record<string, any> | null {
    if (string === null || string === undefined) return string;
    try {
        return JSON.parse(string);
    } catch (e) {
        console.error(`Error parsing "${string}"`, e);
        return null;
    }
}

export function getChannelWithMessage(rawMessage: string | string[]): (Record<string, any> | null)[] {
    if (Array.isArray(rawMessage)) {
        return rawMessage.map((m) => {
            const index = m.indexOf("{");
            return parseSafeNull(m.substring(index));
        });
    } else {
        const index = rawMessage.indexOf("{");
        return [parseSafeNull(rawMessage.substring(index))];
    }
}

/**
 * Async iterator for incoming messages (yields batches).
 */
export async function* messages() {
    for await (const msgParts of zmqPull) {
        // msgParts is an array of buffers (multipart batch)
        const strings = msgParts.map((b) => b.toString());
        const parsedBatch = getChannelWithMessage(strings); // returns array of messages
        yield parsedBatch; // yield the entire batch
    }
}
