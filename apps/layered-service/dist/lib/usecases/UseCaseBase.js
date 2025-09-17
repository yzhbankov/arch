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
exports.UseCaseBase = void 0;
const utils_1 = require("../utils");
class UseCaseBase {
    run(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleanParams = this.parse(params);
            if (cleanParams) {
                return this.execute(cleanParams);
            }
            return null;
        });
    }
    parse(params) {
        if (typeof params === 'string') {
            return (0, utils_1.parseSafeNull)(params);
        }
        return params;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return params;
        });
    }
}
exports.UseCaseBase = UseCaseBase;
