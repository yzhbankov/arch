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
exports.startServer = startServer;
exports.stopServer = stopServer;
const http_1 = __importDefault(require("http"));
const controller_1 = __importDefault(require("./controller"));
let server = null;
function startServer({ serverPort, zmqPullClient }) {
    // Http Server is using with the tests purposes
    server = http_1.default.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{}');
    });
    server.listen(serverPort, () => __awaiter(this, void 0, void 0, function* () {
        console.log('Server listening on port:', serverPort);
        zmqPullClient.on('message', controller_1.default);
        zmqPullClient.on('error', (error) => {
            console.error('Zmq Pull Client Error', error);
        });
        yield zmqPullClient.start();
    }));
}
function stopServer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!server) {
            console.log('Server is not running');
            return;
        }
        server.close(() => {
            console.log('Server stopped');
        });
    });
}
