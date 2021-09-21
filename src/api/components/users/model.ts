 export  default class userModel {
     
 public names:string;
 public surnames:string;
 public full_name:string;
 public prefix_number:string;
 public phone_number:number;
 public email:string;
 public type_user_id:string;
 public document_type_id : string;
 public avatar :string;
 public country_id : string
  constructor(datas:any) {
      this.names = datas.names,
      this.surnames = datas.surnames,
      this.full_name = `${datas.names} ${datas.surnames}`,
      this.prefix_number = datas.prefix_number,
      this.phone_number = datas.phone_number,
      this.email = datas.email,
      this.type_user_id = "1",
      this.document_type_id = datas.document_type_id,
      this.avatar = datas.avatar,
      this.country_id = datas.country_id
      return {...this}
    }
}