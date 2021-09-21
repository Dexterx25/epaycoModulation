"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userModel {
    constructor(datas) {
        this.token_card = datas.token_card,
            this.name = datas.name,
            this.last_name = datas.last_name,
            this.email = datas.email,
            this.default = datas.default,
            this.city = datas.city;
        this.address = datas.address,
            this.phone = datas.phone,
            this.cell_phone = datas.cell_phone;
        return Object.assign({}, this);
    }
}
exports.default = userModel;
//# sourceMappingURL=model.js.map