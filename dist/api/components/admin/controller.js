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
const bcrypt_1 = __importDefault(require("bcrypt"));
const index_1 = __importDefault(require("../auth/index"));
const index_2 = require("../../../utils/actions/admins/index");
const mailValidator_1 = __importDefault(require("./mailValidator"));
function default_1(injectedStore, injectedCache) {
    let cache = injectedCache;
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }
    if (!cache) {
        cache = require('../../../store/dummy');
    }
    let table = 'admins';
    let procedence = '[USER CONTROLLER]';
    const insert = ({ datas, type }) => __awaiter(this, void 0, void 0, function* () {
        console.warn('DATAS controller--->', datas, type);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const responValidator = yield index_2.Validator(datas);
            if (responValidator) {
                reject({ msg: responValidator });
                return false;
            }
            const body = {
                data: {
                    names: datas.names,
                    surnames: datas.surnames,
                    full_name: `${datas.names} ${datas.surnames}`,
                    prefix_number: datas.prefix_number,
                    weight: datas.weight,
                    height: datas.height,
                    phone_number: datas.phone_number,
                    email: datas.email,
                    date_birtday: datas.date_birtday,
                    encrypted_password: yield bcrypt_1.default.hash(datas.password, 5),
                    user_category: 'admin_user'
                },
                type: type
            };
            const { data } = body;
            yield mailValidator_1.default(data, reject, datas);
            try {
                const registerRespon = yield store.upsert(table, body);
                console.log('REgisterRespon--->', registerRespon);
                const responAuth = yield index_1.default.upsert(registerRespon, {
                    encrypted_password: yield bcrypt_1.default.hash(datas.password, 5),
                    id: registerRespon.id,
                    email: registerRespon.email
                }, 'admins');
                console.log('returning responAuth.--->', responAuth);
                const { email } = Object.assign(registerRespon, responAuth);
                console.log('email controller Auth-->', email);
                const res = yield index_1.default.insert(email, datas.password, table);
                resolve(res);
            }
            catch (e) {
                console.log('error controll admin--->', e);
                yield index_2.midlleHandleError(e, table, body, resolve, reject);
            }
        }));
    });
    function get(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
    return {
        insert,
        get
    };
}
exports.default = default_1;
//# sourceMappingURL=controller.js.map