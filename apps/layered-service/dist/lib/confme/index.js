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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = confme;
const fs = __importStar(require("fs"));
const livr_1 = __importDefault(require("livr"));
const livr_extra_rules_1 = __importDefault(require("livr-extra-rules"));
function replace(template, vars) {
    return template.replace(/\{\{(.+?)\}\}/g, (match, p1) => {
        // eslint-disable-next-line no-prototype-builtins
        if (vars.hasOwnProperty(p1)) {
            return vars[p1];
        }
        throw new Error(`Variable "${p1}" not set!`);
    });
}
function validateConfig(config, livrSchemaPath) {
    const livrRules = JSON.parse(fs.readFileSync(livrSchemaPath).toString());
    const validator = new livr_1.default.Validator(livrRules);
    validator.registerRules(livr_extra_rules_1.default);
    const validConfig = validator.validate(config);
    if (!validConfig) {
        const error = {
            FAILED_CONFIG: config,
            ERRORS: validator.getErrors(),
        };
        throw new Error(JSON.stringify(error, null, 2));
    }
    return validConfig;
}
function confme(configPath, livrSchemaPath) {
    const template = fs.readFileSync(configPath).toString();
    const configStr = replace(template, process.env);
    let config = {};
    try {
        config = JSON.parse(configStr);
    }
    catch (error) {
        console.error('CANNOT PARSE JSON:', configStr);
        throw error;
    }
    if (livrSchemaPath) {
        config = validateConfig(config, livrSchemaPath);
    }
    return config;
}
