import bcrypt from "bcrypt"
import controllerAuth from "../auth/index"
import {midlleHandleError, Validator} from "../../../utils/actions/admins/index"
import mailValidator from "./mailValidator"

export default function (injectedStore:any, injectedCache:any) {
    let cache = injectedCache
    let store = injectedStore

    if(!store ){
          store = require('../../../store/dummy')
    }
    if(!cache ){
        cache = require('../../../store/dummy')
    }
  let table = 'admins'
  let procedence = '[USER CONTROLLER]'

 const  insert = async ({datas, type}:any) => {
   console.warn('DATAS controller--->', datas, type)
      return new Promise(async(resolve, reject)=>{
      const responValidator = await Validator(datas)
       if(responValidator){
          reject({msg:responValidator});
          return false;
       }
     const body: object = {
      data:{
        names:datas.names,
        surnames:datas.surnames,
        full_name:`${datas.names} ${datas.surnames}`,
        prefix_number:datas.prefix_number,
        weight:datas.weight,
        height:datas.height,
        phone_number:datas.phone_number,
        email:datas.email,
        date_birtday:datas.date_birtday,
        encrypted_password:await bcrypt.hash(datas.password, 5),
        user_category:'admin_user'
        },
    type:type
   }
   const {data} : any = body
   await mailValidator(data, reject, datas)
try {
 const registerRespon: any = await store.upsert(table, body)
  console.log('REgisterRespon--->', registerRespon)

  const responAuth = await controllerAuth.upsert(registerRespon,{
    encrypted_password:await bcrypt.hash(datas.password, 5),
    id:registerRespon.id,
    email:registerRespon.email 
    }, 'admins')
    console.log('returning responAuth.--->', responAuth)
    
    const {email} = Object.assign(registerRespon, responAuth)
    console.log('email controller Auth-->', email)
    
   const res =  await controllerAuth.insert(email, datas.password, table)  
  resolve(res)
} catch (e:any) {
    console.log('error controll admin--->', e)
   await midlleHandleError(e, table, body, resolve, reject)

}
 
})

}
async function get(data:any){
    return new Promise( async (resolve, reject)=>{
          const {filter} = data
          const theData = {type:'getUser', querys:filter}
          console.log('the filter--->', filter)
          let user = await cache.get(filter.id, table)
            if(!user){
                console.log('no estaba en cachee, buscando en db')
                user = await store.get(theData, table)
                cache.upsert(user, table)
            }
         resolve(user)
    })

}
return {
  insert,
  get
}

}