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
exports.default = makeRequestHandler;
function runUseCase(UseCase_1, _a) {
    return __awaiter(this, arguments, void 0, function* (UseCase, { params }) {
        return new UseCase().run(params);
    });
}
function makeRequestHandler(UseCase, mapToParams) {
    function logRequest(params, result, startTime) {
        console.log({
            useCase: UseCase.name,
            runtime: Date.now() - startTime,
            params,
            result,
        });
    }
    return function routerHandler(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTime = Date.now();
                const params = mapToParams(message);
                const result = yield runUseCase(UseCase, { params });
                // logRequest(params, result, startTime);
            }
            catch (err) {
                console.error(err);
            }
        });
    };
}
