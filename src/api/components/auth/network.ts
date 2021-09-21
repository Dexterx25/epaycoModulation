import expres, {Request, Response, NextFunction,Router}  from 'express'
import { ConsoleResponse, ServerResponse} from '../../../utils/responses/index'
import controller from './index'
const router: Router = Router()
const chalk = require('chalk')
let procedence = '[NETWORK AUTH]'



router.post('/login', function(req:Request, res:Response, next:NextFunction){
  console.log('THIS IS THE BODY INSERT LOGIN-->', req.body)
    controller.insert(req.body.email, req.body.password, 'users')
      .then((token:any)=>{
        console.log('THIS IS THE TOKEN--->', token)
        if(!token){         
           ConsoleResponse.error(procedence, 'token Not Is Here')
           return next;
        }else{         
          ConsoleResponse.success(procedence, token)
          ServerResponse.success(req, res,  token, 201)
        }
        })
       .catch(next)
})
  

export default router;