export  default class userModel {
     
    public token_card:string;
    public name:string;
    public last_name:string;
    public email:string;
    public default: string;
    public city : string;
    public address : string;
    public phone : string;
    public cell_phone : string;
     constructor(datas:any) {
         this.token_card = datas.token_card,
         this.name = datas.name,
         this.last_name = datas.last_name,
         this.email = datas.email,
         this.default = datas.default,
         this.city = datas.city
         this.address = datas.address,
         this.phone = datas.phone,
         this.cell_phone = datas.cell_phone
         return {...this}
       }
   }