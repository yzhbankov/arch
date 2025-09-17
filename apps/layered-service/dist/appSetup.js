"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.main = main;
const repository_1 = require("./lib/repository");
const db_1 = require("./lib/db");
const infrastructure_1 = require("./lib/infrastructure");
const ZmqApi = __importStar(require("./lib/api/zmqApi"));
const ConfigContainer = __importStar(require("./lib/config"));
const ModelBase_1 = __importDefault(require("./lib/models/ModelBase"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const zmqPushClient = new infrastructure_1.ZmqPushClient({ address: ConfigContainer.config.zmq.pushAddress, log: ConfigContainer.config.zmq.log });
        const zmqPullClient = new infrastructure_1.ZmqPullClient({ address: ConfigContainer.config.zmq.pullAddress, log: ConfigContainer.config.zmq.log });
        const dbConnection = yield (0, db_1.createDbConnection)({
            socket: {
                port: ConfigContainer.config.db.port,
                host: ConfigContainer.config.db.host,
            },
        });
        // Init Domain Model Layer
        ModelBase_1.default.setRepository(new repository_1.Repository({
            repositoryInstance: dbConnection,
            prefix: ConfigContainer.config.db.prefix,
        }));
        // Init Service Layer
        ModelBase_1.default.setZmqPushClient(zmqPushClient);
        // Init Controllers Layer (API)
        ZmqApi.startServer({
            serverPort: ConfigContainer.config.serverPort,
            zmqPullClient
        });
        // Add Global Unhandled Errors Handlers
        function exit() {
            return __awaiter(this, void 0, void 0, function* () {
                yield ZmqApi.stopServer();
                zmqPullClient.destroy();
                console.log('[rtls-asset-tracking-message-processor] Exit');
                process.exit(0);
            });
        }
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            console.error('[rtls-asset-tracking-message-processor] SIGTERM signal caught');
            yield exit();
        }));
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            console.error('[rtls-asset-tracking-message-processor] SIGINT signal caught');
            yield exit();
        }));
        process.on('unhandledRejection', (error) => {
            console.error('[rtls-asset-tracking-message-processor] unhandledRejection', error.stack);
        });
        process.on('uncaughtException', (error) => {
            console.error('[rtls-asset-tracking-message-processor] uncaughtException', error.stack);
        });
    });
}
