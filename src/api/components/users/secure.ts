import * as auth from '../../../authorizations/index'
import {Request,Response, NextFunction} from 'express'

export default  function cheakAuth(action:any){
    
async function middleware (req:Request, res:Response, next:NextFunction){
       switch(action){
           case 'update':
               console.log('Update MIDLLLLLLLLLLEEEE')
            await auth.cheak.logged(req, res)
                next();
                break
           case 'get':
                console.log('for getttt', req.headers)
            await  auth.cheak.logged(req, res)
                next()
                break
           case 'list':
               console.log('LISTT MIDDLEWARE!')
         await  auth.cheak.logged(req, res)
                next();
                break;
           case 'filter':
          await auth.cheak.logged(req, res)
                next();
           default:
                next();
       } 

   }
   return middleware;

}