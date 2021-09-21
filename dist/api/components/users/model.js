"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class userModel {
    constructor(datas) {
        this.names = datas.names,
            this.surnames = datas.surnames,
            this.full_name = `${datas.names} ${datas.surnames}`,
            this.prefix_number = datas.prefix_number,
            this.phone_number = datas.phone_number,
            this.email = datas.email,
            this.type_user_id = "1",
            this.document_type_id = datas.document_type_id,
            this.avatar = datas.avatar,
            this.country_id = datas.country_id;
        return Object.assign({}, this);
    }
}
exports.default = userModel;
//# sourceMappingURL=model.js.map