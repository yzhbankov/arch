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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = exports.EntityDocument = void 0;
class EntityDocument {
    constructor(options) {
        const { repositoryInstance, prefix } = options;
        this.repoInstance = repositoryInstance;
        this.prefix = prefix;
    }
    findByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.repoInstance.hGetAll(`${this.prefix}:entity:${key}`);
                if (!result || Object.keys(result).length === 0) {
                    return null;
                }
                // Return the first value (or adjust to return a specific field)
                return (_a = Object.values(result)[0]) !== null && _a !== void 0 ? _a : null;
            }
            catch (e) {
                console.error('Redis error in findByKey:', e);
                return null;
            }
        });
    }
    save(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repoInstance.del(`${this.prefix}:entity:${key}`);
                yield this.repoInstance.hSet(`${this.prefix}:entity:${key}`, [value]);
                return value;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.EntityDocument = EntityDocument;
class Repository {
    constructor(options) {
        this.entity = new EntityDocument(options);
    }
}
exports.Repository = Repository;
