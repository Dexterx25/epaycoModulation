import bcrypt from "bcrypt"
import  controllerAuth from "../../api/components/auth/index"
import {midlleHandleError, Validator, ConvertingsId_type} from "../../utils/actions/personas/index"
import * as auth from "../../authorizations/index"
import  userModel from "./model";
import {config} from '../../configurations/index'
import {getToken, tokenCard, createCustomer, getCustomer, listCustommers, updateCustomer,  addNewTokenExistingClient, deleteCustomerToken} from '../../utils/actions/epayco'

// let epayco = require('epayco-sdk-node')({
//     apiKey: config.msv_epayco.public_key,
//     privateKey: config.msv_epayco.private_key,
//     lang: 'ES',
//     test: true
// });
export default function (injectedStore:any, injectedCache:any) {
    let cache = injectedCache
    let store = injectedStore

    if(!store ){
          store = require('../../../store/dummy')
    }
    if(!cache ){
        cache = require('../../../store/dummy')
    }
  let table = 'epayco'

async function insert ({datas, type}:any) {
 return new Promise(async(resolve, reject)=>{   
    const responValidator = await Validator(datas) 
    if(responValidator){
            reject({msg:responValidator});
            return false;
        }
   let registerRespon : any
   let data : any
  
    try{
        if(type == 'create_token'){
            registerRespon = await tokenCard(datas)
            //await epayco.token.create(data)
          }else if(type == 'create_customer'){
            data = new userModel(datas)
            registerRespon = await createCustomer(data)
            //await epayco.customers.create(data)
          }else if (type == 'add_new_token_existed_customer'){
            registerRespon =  await addNewTokenExistingClient(datas)
            // await epayco.customers.addNewToken(datas)
          }
    console.log('RES CONTROLLER AUTH---', registerRespon)
    resolve(registerRespon)
    }catch(e) {
        await midlleHandleError(e, table, datas, resolve, reject)
    }
  })
}

async function list(data:any){ 
 return new Promise(async(resolve, reject) =>{
  let users  = await cache.list(table)
   if(!users){
       users = await listCustommers(data)
       //await epayco.customers.list()
         cache.upsert(users, table)
    }else{
      console.log('datos traidos de la cache')
   }         
   resolve(users)
 })
}

async function get(data:any){
  return new Promise( async (resolve, reject)=>{
    const {filter} = data
     const theData = {type:'getUser', querys:filter}
     console.log('the filter--->', filter)
        let user :any = await cache.get(filter.id, table)
          if(!user){
              console.log('no estaba en cachee, buscando en db')
              user = await getCustomer(data) 
              // await epayco.customers.get(data.id)
              cache.upsert(user, table)
          }
       resolve(user)
  })

}

async function update(theBody:any){

return new Promise (async(resolve, reject) =>{
  const responValidator = await Validator(theBody)
    if(responValidator){
       reject({msg:responValidator});
       return false;
    }

    let data = new userModel(theBody)

  try {
    const dataRespon = await updateCustomer(Object.assign(data, {client_id:theBody.client_id}))
    //  await  epayco.customers.update(theBody.id, data)
    resolve(dataRespon)
  } catch (error) {
    midlleHandleError(error, table, data, resolve, reject)
  }

 })
}

async function remove(datas:any) {
  return new Promise (async (resolve, reject) =>{
      if(!datas){
        reject ({msg:'data Not Suplied!'});
        return false;
      }
     try {
      const respon =  await deleteCustomerToken(datas)
      // await  epayco.customers.delete(datas)
        return respon
     } catch (error) {
         midlleHandleError(error, table, datas, resolve, reject);
     }
  })
}

return {
  insert,
  list,
  get,
  update,
  remove
}

}