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
exports.Entities = void 0;
const ModelBase_1 = __importDefault(require("./ModelBase"));
class Entities extends ModelBase_1.default {
    constructor() {
        super();
    }
    findByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const entity = yield ((_a = this.repository) === null || _a === void 0 ? void 0 : _a.entity.findByKey(key));
            if (!entity) {
                return null;
            }
            return entity;
        });
    }
    save(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const entity = yield ((_a = this.repository) === null || _a === void 0 ? void 0 : _a.entity.save(key, value));
            if (!entity) {
                return null;
            }
            return entity;
        });
    }
    send(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.zmqPushClient) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(message)));
        });
    }
}
exports.Entities = Entities;
