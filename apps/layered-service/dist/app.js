"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appSetup_1 = require("./appSetup");
(0, appSetup_1.main)().catch((err) => {
    console.error(err);
    process.exit(1);
});
