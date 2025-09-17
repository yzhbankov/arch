"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZMQ_PULL_CHANNELS = void 0;
exports.default = default_1;
const entity_1 = __importDefault(require("./entity"));
const utils_1 = require("../../../utils");
exports.ZMQ_PULL_CHANNELS = {
    ENTITY: '~entity',
};
function default_1(messageRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        const { channel, message } = (0, utils_1.getChannelWithMessage)(messageRaw);
        switch (channel) {
            case exports.ZMQ_PULL_CHANNELS.ENTITY: {
                yield entity_1.default.post(message || {});
                return null;
            }
        }
        return null;
    });
}
