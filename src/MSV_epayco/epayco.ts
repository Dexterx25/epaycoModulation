import express,{Application} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errors from '../utils/responses/errors';
import {config} from '../configurations'

const app: Application = express()

import path from 'path'
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

import Epayco from './components/network'
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/epayco', Epayco)
app.use(errors)

app.listen(6001, () =>{
    console.log(`Microservices Runing XDD into ${config.api.host}:${config.api.port}`);
})

