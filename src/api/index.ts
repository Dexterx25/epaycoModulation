import express,{Application}from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import errors from '../utils/responses/errors'
let {config} = require('../configurations/index')
const app: Application = express();
import path from 'path'
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));


import user from './components/users/network'
import admin from './components/admin/network'
import auth from './components/auth/network'
app.use('/api/users', user)
app.use('/api/admins', admin)
app.use('/api/auth', auth)
app.use(errors)

app.listen(config.api.port, () =>{
    console.log(`Api Runing XDD into ${config.api.host}:${config.api.port}`);
})