import request  from "request";
import  {config} from '../../../configurations/index'
import path from 'path'
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

export function getToken(params:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':'https://api.secure.payco.co/v1/auth/login',
            'headers': {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                "public_key": config.msv_epayco.public_key,
                "private_key": config.msv_epayco.private_key      
            })
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body)
          });
    })
}

export function tokenCard(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':'https://api.secure.payco.co/v1/tokens',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },

            body: JSON.stringify({
                "card[number]":datas.card_number,
                "card[exp_year]":datas.exp_year,
                "card[exp_month]":datas.exp_month,
                "card[cvc]":datas.cvc
            })
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body)
          });
    })
}

export function createCustomer(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':'https://api.secure.payco.co/payment/v1/customer/create',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },

            body: JSON.stringify(
                {
                    token_card: datas.token_card,
                    name: datas.name,
                    last_name: datas.last_name, //This parameter is optional
                    email: datas.email,
                    phone: datas.phone,
                    default: datas.default,
                    //Optional parameters: These parameters are important when validating the credit card transaction
                    city: datas.city,
                    address: datas.address,
                    cell_phone: datas.cell_phone
            }
            )
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })
}



export function getCustomer(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'GET',
            'url': `https://api.secure.payco.co/payment/v1/customer/${config.msv_epayco.public_key}/${datas.client_id}/`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },
        }
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })
}

export function listCustommers(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'GET',
            'url': `https://api.secure.payco.co/payment/v1/customers/${config.msv_epayco.public_key}`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },
        }
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })    
}


export function updateCustomer(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':`https://api.secure.payco.co/payment/v1/customer/edit/${config.msv_epayco.public_key}/${datas.client_id}`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },

            body: JSON.stringify(
                 {
                    name: datas.name,
                    last_name: datas.last_name, //This parameter is optional
                    email: datas.email,
                    phone: datas.phone,
                    default: datas.default,
                    city: datas.city,
                    address: datas.address,
                    cell_phone: datas.cell_phone
              }
            )
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })
}

export function addNewTokenExistingClient(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':`https://api.secure.payco.co/v1/customer/add/token`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },

            body: JSON.stringify(
                 {
                    "token_card" : datas.token_card,
                    "customer_id" :  datas.customer_id
              }
            )
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })
}


export function deleteCustomerToken(datas:any) {
    return new Promise((resolve, reject)=>{
        const options = {
            'method':'POST',
            'url':`https://api.secure.payco.co/v1/remove/token`,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${datas.token}` 
              },

            body: JSON.stringify(
                 {
                    "franchise": datas.franchise,
                    "mask":datas.mask,
                    "customer_id":datas.customer_id
              }
            )
        }
    
        request(options, function (error, response) {
            if (error) reject({msg:error});
            console.log(response.body);
            resolve(response.body.data)
          });
    })
}