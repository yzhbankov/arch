"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSafeNull = parseSafeNull;
exports.getChannelWithMessage = getChannelWithMessage;
function parseSafeNull(string) {
    let result = null;
    if (string === null || string === undefined) {
        return string;
    }
    try {
        result = JSON.parse(string);
    }
    catch (e) {
        console.error(`Error parsing "${string}"`, e);
    }
    return result;
}
function getChannelWithMessage(rawMessage) {
    const index = rawMessage.indexOf('{');
    const channel = rawMessage.substring(0, index).trimEnd().trimStart() || '';
    const message = parseSafeNull(rawMessage.substring(index));
    return {
        channel,
        message,
    };
}
