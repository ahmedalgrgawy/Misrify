import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { helloFun } from './controllers/hello.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json())

app.use(cookieParser())

// app.use('/api/')  // for next routes

app.use('/', helloFun)

console.log(process.env.NODE_ENV);

app.listen(port, () => {
    console.log('Server Running with: ' + process.env.NODE_ENV + 'Environment');
    // dbConnection
    console.log('Server Running on port: ' + port)
})

