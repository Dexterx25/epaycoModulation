import {nanoid} from 'nanoid'
import bcrypt from 'bcrypt'
import * as auth from '../../../authorizations/index'
import chalk from 'chalk'

export default function (injectedStore:any){
let store = injectedStore

if(!store){
    store = require('../../../store/store')
}
let table2 = 'authentications'
let procedence = '[CONTROLLER AUTH]'

const insert = (email:string, password:string, type?:any) =>{
  return new Promise( async(resolve, reject)=>{
    const data :any = await store.query(table2, {email:email}, new Array(type))

  const areEqual = await bcrypt.compare(password, data.encrypted_password)
       if(areEqual == true){
             const token = await auth.sign(data)
             const {id, encrypted_password, ...newObject} = data
             const dataReturn = Object.assign({token}, newObject)
               console.log(`${procedence} ====> insertLogin XDDDD - `, data, token)
              resolve(dataReturn)
           }else{
               reject({msg:'Invalid Password'})
            }
  })
}
//user auth
const upsert = async(respon:any, data:any, type:string) =>{
    console.log('DATAS UPSERT ---->', data)
    let authData : any = ''
    
  if(type == 'admins'){
      authData = {
        data:{
          admin_id:respon.id,
          encrypted_password: data.encrypted_password, 
          email:data.email
        },     
        type:'insert_auth_admins'
     }
    }else if(type = 'users'){
      authData = {
        data:{
          user_id:respon.id,
          encrypted_password: data.encrypted_password, 
          email:data.email
        },     
        type:'insert_auth_users'
     }  
    }
   
      console.log(`${procedence} ====> upsertAuth authData body -> ${chalk.blueBright(data)}`)
      return  store.upsert(table2, authData)
}

return {
  insert,
  upsert
}

}