"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usecases_1 = require("../../../usecases");
const makeRequestHandler_1 = __importDefault(require("../../utils/makeRequestHandler"));
exports.default = {
    post: (0, makeRequestHandler_1.default)(usecases_1.EntitySave, (message) => message || {}),
};
