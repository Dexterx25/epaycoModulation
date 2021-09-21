"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../auth/index"));
const index_2 = require("../../../utils/actions/personas/index");
const auth = __importStar(require("../../../authorizations/index"));
const model_1 = __importDefault(require("./model"));
function default_1(injectedStore, injectedCache) {
    let cache = injectedCache;
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }
    if (!cache) {
        cache = require('../../../store/dummy');
    }
    let table = 'users';
    function insert({ datas, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const responValidator = yield index_2.Validator(datas);
                if (responValidator) {
                    reject({ msg: responValidator });
                    return false;
                }
                let data = new model_1.default(datas);
                try {
                    const registerRespon = yield store.upsert(table, { data, type });
                    const responAuth = yield index_1.default.upsert(registerRespon, {
                        encrypted_password: yield bcrypt_1.default.hash(datas.password, 5),
                        id: registerRespon.id,
                        email: registerRespon.email
                    }, 'users');
                    const { email } = Object.assign(registerRespon, responAuth);
                    const res = yield index_1.default.insert(email, datas.password, table);
                    console.log('RES CONTROLLER AUTH---', res);
                    resolve(res);
                }
                catch (e) {
                    yield index_2.midlleHandleError(e, table, datas, resolve, reject);
                }
            }));
        });
    }
    function list(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let users = yield cache.list(table);
                if (!users) {
                    users = yield store.list(table);
                    cache.upsert(users, table);
                }
                else {
                    console.log('datos traidos de la cache');
                }
                resolve(users);
            }));
        });
    }
    function get(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const returnloged = auth.cheak.logged(data);
                if (returnloged.error) {
                    reject({ msg: 'Error de permisos de seguridad, token inválido', statusCode: 401 });
                    return false;
                }
                const { filter } = data;
                const theData = { type: 'getUser', querys: filter };
                console.log('the filter--->', filter);
                let user = yield cache.get(filter.id, table);
                if (!user) {
                    console.log('no estaba en cachee, buscando en db');
                    user = yield store.get(theData, table);
                    cache.upsert(user, table);
                }
                resolve(user);
            }));
        });
    }
    function update(theBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const returnloged = auth.cheak.logged(theBody);
                if (returnloged.error) {
                    reject({ msg: 'Error de permisos de seguridad, token inválido', statusCode: 401 });
                    return false;
                }
                const responValidator = yield index_2.Validator(theBody);
                if (responValidator) {
                    reject({ msg: responValidator });
                    return false;
                }
                let data = new model_1.default(theBody);
                try {
                    const filter = theBody;
                    const theData = { type: 'getUser', querys: filter };
                    const filterUser = yield store.get(theData, table);
                    const dataRespon = yield store.upsert(table, Object.assign(data, { id: filterUser, type: theBody.type }));
                    resolve(dataRespon);
                }
                catch (error) {
                    index_2.midlleHandleError(error, table, data, resolve, reject);
                }
            }));
        });
    }
    return {
        insert,
        list,
        get,
        update
    };
}
exports.default = default_1;
//# sourceMappingURL=controller.js.map