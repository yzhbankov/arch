import { Pull } from 'zeromq';
export const zmqPull = new Pull();

export async function initPull(address: string) {
    zmqPull.bindSync(address);
    console.log(`ZMQ Pull bind ${address}`);
}

function parseSafeNull(string: string | null): Record<string, any>|null {
    let result = null;
    if (string === null || string === undefined) {
        return string;
    }
    try {
        result = JSON.parse(string);
    } catch (e) {
        console.error(`Error parsing "${string}"`, e);
    }
    return result;
}

export function getChannelWithMessage(rawMessage: string) {
    const index = rawMessage.indexOf('{');
    // const channel = rawMessage.substring(0, index).trimEnd().trimStart() || '';
    return parseSafeNull(rawMessage.substring(index));
}

// Async iterator for messages
export async function* messages() {
    for await (const [msg] of zmqPull) {
        yield getChannelWithMessage(msg.toString());
    }
}
