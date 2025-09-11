export function parseSafeNull(string: string | null): Record<string, any>|null {
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

type ZmqMessageChannelType = {
    channel: string
    message: Record<string, any>|null
}

export function getChannelWithMessage(rawMessage: string): ZmqMessageChannelType {
    const index = rawMessage.indexOf('{');
    const channel = rawMessage.substring(0, index).trimEnd().trimStart() || '';
    const message = parseSafeNull(rawMessage.substring(index));

    return {
        channel,
        message,
    };
}
