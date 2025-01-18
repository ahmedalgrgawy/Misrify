import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDb } from './lib/connectDb.js';
import { wrapRoutes } from './routes/index.routes.js';
import bodyParser from 'body-parser'
import errorHandler from './middlewares/error.middlewares.js';

dotenv.config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

app.use(express.json())

app.use(bodyParser.json());

app.use(cookieParser())

wrapRoutes(app)

app.use(errorHandler);

app.listen(port, () => {
    console.log('Server Running in ' + process.env.NODE_ENV + 'Environment on port ' + port);
    connectDb()
})

