import { config } from 'dotenv';

import { connectDB } from './db/index.js';
import express from 'express';
config()

const app = express()

connectDB().then(
    ()=>{
        app.listen(process.env.PORT || 8000 ,()=>{
            console.log("SERVER IS RUNNING", process.env.PORT)
        })
    }
).catch((error)=>{console.log("MONGO connection failed",error);})


