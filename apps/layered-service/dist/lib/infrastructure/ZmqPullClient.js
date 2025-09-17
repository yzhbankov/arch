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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZmqPullClient = void 0;
const zeromq_1 = require("zeromq");
const events_1 = __importDefault(require("events"));
class ZmqPullClient extends events_1.default {
    constructor(config) {
        super();
        this.config = config;
        this.socket = new zeromq_1.Pull();
        this.socket.connect(config.address);
        console.log(`ZMQ pull client connected to address: ${config.address}`);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            console.log('ZMQ pull client start');
            try {
                for (var _d = true, _e = __asyncValues(this.socket), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const [msg] = _c;
                    if (this.config.log) {
                        console.log('PULL:', msg.toString());
                    }
                    this.emit('message', msg.toString());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    destroy() {
        this.socket.close();
        console.log('ZMQ pull client closed');
    }
}
exports.ZmqPullClient = ZmqPullClient;
