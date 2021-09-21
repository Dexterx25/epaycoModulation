"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const errors_1 = __importDefault(require("../utils/responses/errors"));
const configurations_1 = require("../configurations");
const app = express_1.default();
const path_1 = __importDefault(require("path"));
require('dotenv').config({ path: path_1.default.resolve(__dirname, '../../.env') });
const network_1 = __importDefault(require("./components/network"));
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/api/epayco', network_1.default);
app.use(errors_1.default);
app.listen(6001, () => {
    console.log(`Microservices Runing XDD into ${configurations_1.config.api.host}:${configurations_1.config.api.port}`);
});
//# sourceMappingURL=epayco.js.map