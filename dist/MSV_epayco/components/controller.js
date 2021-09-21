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
const index_1 = require("../../utils/actions/personas/index");
const model_1 = __importDefault(require("./model"));
const index_2 = require("../../configurations/index");
let epayco = require('epayco-sdk-node')({
    apiKey: index_2.config.msv_epayco.public_key,
    privateKey: index_2.config.msv_epayco.private_key,
    lang: 'ES',
    test: true
});
function default_1(injectedStore, injectedCache) {
    let cache = injectedCache;
    let store = injectedStore;
    if (!store) {
        store = require('../../../store/dummy');
    }
    if (!cache) {
        cache = require('../../../store/dummy');
    }
    let table = 'epayco';
    function insert({ datas, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const responValidator = yield index_1.Validator(datas);
                if (responValidator) {
                    reject({ msg: responValidator });
                    return false;
                }
                let registerRespon;
                let data;
                try {
                    if (type == 'create_token') {
                        data = { "card[number]": datas.card_number, "card[exp_year]": datas.exp_year, "card[exp_month]": datas.exp_month, "card[cvc]": datas.cvc };
                        registerRespon = yield epayco.token.create(data);
                    }
                    else if (type == 'create_customer') {
                        data = new model_1.default(datas);
                        registerRespon = yield epayco.customers.create(data);
                    }
                    else if (type == 'add_new_token_existed_customer') {
                        registerRespon = yield epayco.customers.addNewToken(datas);
                    }
                    console.log('RES CONTROLLER AUTH---', registerRespon);
                    resolve(registerRespon);
                }
                catch (e) {
                    yield index_1.midlleHandleError(e, table, datas, resolve, reject);
                }
            }));
        });
    }
    function list(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let users = yield cache.list(table);
                if (!users) {
                    users = yield epayco.customers.list();
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
                const { filter } = data;
                const theData = { type: 'getUser', querys: filter };
                console.log('the filter--->', filter);
                let user = yield cache.get(filter.id, table);
                if (!user) {
                    console.log('no estaba en cachee, buscando en db');
                    user = yield epayco.customers.get(data.id);
                    cache.upsert(user, table);
                }
                resolve(user);
            }));
        });
    }
    function update(theBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const responValidator = yield index_1.Validator(theBody);
                if (responValidator) {
                    reject({ msg: responValidator });
                    return false;
                }
                let data = new model_1.default(theBody);
                try {
                    const dataRespon = yield epayco.customers.update(theBody.id, data);
                    resolve(dataRespon);
                }
                catch (error) {
                    index_1.midlleHandleError(error, table, data, resolve, reject);
                }
            }));
        });
    }
    function remove(datas) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!datas) {
                    reject({ msg: 'data Not Suplied!' });
                    return false;
                }
                try {
                    const respon = yield epayco.customers.delete(datas);
                    return respon;
                }
                catch (error) {
                    index_1.midlleHandleError(error, table, datas, resolve, reject);
                }
            }));
        });
    }
    return {
        insert,
        list,
        get,
        update,
        remove
    };
}
exports.default = default_1;
//# sourceMappingURL=controller.js.map