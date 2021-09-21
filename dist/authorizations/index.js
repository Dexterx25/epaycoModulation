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
exports.decodeHeader = exports.getToken = exports.cheak = exports.verify = exports.sign = void 0;
const index_1 = require("../configurations/index");
const errors_1 = __importDefault(require("../utils/responses/errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = index_1.config.jwt.secret;
function sign(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jsonwebtoken_1.default.sign(data, SECRET);
    });
}
exports.sign = sign;
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jsonwebtoken_1.default.verify(token, SECRET);
    });
}
exports.verify = verify;
exports.cheak = {
    own: function (req, res, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield decodeHeader(req);
            //VERIFY IF IS OWNER:
            if (decoded.id !== owner) {
                return { error: 'Not is Owner', statusCode: 400 };
            }
        });
    },
    logged: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = yield decodeHeader(req);
                console.log('DECODED LOGEDD---->', decoded);
                return { token_decoded: decoded };
            }
            catch (error) {
                console.log('error LOGGED--->', error.message);
                switch (error.message) {
                    case 'jwt malformed':
                        yield errors_1.default(Object.assign({ msg: 'Token No Válido' }, { statusCode: 400 }), req, res);
                        break;
                    default:
                        break;
                }
            }
        });
    }
};
function getToken(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!auth) {
            console.log('Noy bring token');
            return ({ error: "Don`t bring Token", statusCode: 401 });
        }
        if (auth.indexOf("Bearer ") === -1) {
            console.log('invalid Format');
            return ({ error: "Formato inválido", statusCode: 401 });
        }
        let token = auth.replace("Bearer ", "");
        return token;
    });
}
exports.getToken = getToken;
function decodeHeader(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const { headers, token } = req;
        const authorization = !headers ? token : headers.authorization || '';
        const thetoken = yield getToken(authorization);
        const decoded = yield verify(thetoken);
        req.user = decoded;
        return decoded;
    });
}
exports.decodeHeader = decodeHeader;
//# sourceMappingURL=index.js.map