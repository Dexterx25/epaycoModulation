import {config} from '../configurations/index'
import errors from '../utils/responses/errors'
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken';
import {decode} from 'jsonwebtoken'

const SECRET = config.jwt.secret;

export async function sign(data:any){
 return  await  jwt.sign(data, SECRET)
}

export async function verify (token:any){
  return  await jwt.verify(token, SECRET)
}

export const cheak : any = {
    own: async function(req:Request, res:Response, owner:any){
     const decoded : any = await decodeHeader(req);

    //VERIFY IF IS OWNER:
    if (decoded.id !== owner) {
        return {error:'Not is Owner', statusCode:400}
    }
 },

    logged: async function(req:Request, res:Response){
        try {
            const decoded = await decodeHeader(req);
            console.log('DECODED LOGEDD---->', decoded)
            return {token_decoded:decoded};
        } catch (error) {
            console.log('error LOGGED--->',error.message)
            switch (error.message) {
                case 'jwt malformed':
                    await errors(Object.assign({msg:'Token No Válido'}, {statusCode:400}), req, res)
                    break;
            
                default:
                    break;
            }
        }
    }
}

export async function getToken(auth:any){ 
    if(!auth){
        console.log('Noy bring token')
        return ({error:"Don`t bring Token", statusCode:401})
    }

    if(auth.indexOf("Bearer ") === -1){
        console.log('invalid Format')
        return ({error:"Formato inválido", statusCode:401})

    }

    let token = auth.replace("Bearer ", "");

    return token

}

export async function decodeHeader(req:any){
    const {headers, token} = req
    const authorization = !headers ? token : headers.authorization || '';
    const thetoken = await  getToken(authorization)
    const decoded = await  verify(thetoken)

    req.user = decoded

 return decoded;
}

