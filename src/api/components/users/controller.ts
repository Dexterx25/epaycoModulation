import bcrypt from "bcrypt"
import  controllerAuth from "../auth/index"
import {midlleHandleError, Validator, ConvertingsId_type} from "../../../utils/actions/personas/index"
import * as auth from "../../../authorizations/index"
import  userModel from "./model"

export default function (injectedStore:any, injectedCache:any) {
    let cache = injectedCache
    let store = injectedStore

    if(!store ){
          store = require('../../../store/dummy')
    }
    if(!cache ){
        cache = require('../../../store/dummy')
    }
  let table = 'users'

async function insert ({datas, type}:any) {
return new Promise(async(resolve, reject)=>{   

const responValidator = await Validator(datas) 
   if(responValidator){
          reject({msg:responValidator});
          return false;
    }
  let data = new userModel(datas)
try{
const registerRespon: any = await store.upsert(table, {data, type})

const responAuth = await controllerAuth.upsert(registerRespon,{
   encrypted_password:await bcrypt.hash(datas.password, 5),
   id:registerRespon.id,
   email:registerRespon.email 
   },'users')
  
const {email} = Object.assign(registerRespon, responAuth)
const res =  await controllerAuth.insert(email, datas.password, table)  
console.log('RES CONTROLLER AUTH---', res)
  resolve(res)
 }catch(e) {
   await midlleHandleError(e, table, datas, resolve, reject)
}

})

}

async function list(data:any){ 
 return new Promise(async(resolve, reject) =>{
let users  = await cache.list(table)
   if(!users){
       users = await store.list(table)
         cache.upsert(users, table)
   }else{
      console.log('datos traidos de la cache')
   }         
   resolve(users)
 })
}

async function get(data:any){
  return new Promise( async (resolve, reject)=>{
    const returnloged = auth.cheak.logged(data)
    if(returnloged.error){
     reject({msg:'Error de permisos de seguridad, token inválido', statusCode:401});
     return false;
    }
        const {filter} = data
        const theData = {type:'getUser', querys:filter}

        console.log('the filter--->', filter)

        let user :any = await cache.get(filter.id, table)
          if(!user){
              console.log('no estaba en cachee, buscando en db')
              user = await store.get(theData, table)
              
              cache.upsert(user, table)
          }
       resolve(user)
  })

}

async function update(theBody:any){

return new Promise (async(resolve, reject) =>{

 const returnloged = auth.cheak.logged(theBody)
   if(returnloged.error){
    reject({msg:'Error de permisos de seguridad, token inválido', statusCode:401});
    return false;
   }
   
  const responValidator = await Validator(theBody)
    if(responValidator){
       reject({msg:responValidator});
       return false;
    }

    let data = new userModel(theBody)

  try {
    const filter = theBody;
    const theData = {type:'getUser', querys:filter}
    const filterUser = await store.get(theData, table)

    const dataRespon =  await  store.upsert(table, Object.assign(data, {id:filterUser, type:theBody.type}))
    resolve(dataRespon)
  } catch (error) {
    midlleHandleError(error, table, data, resolve, reject)
  }
 
 })
}

return {
  insert,
  list,
  get,
  update
}

}