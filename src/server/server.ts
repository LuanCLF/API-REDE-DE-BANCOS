import './shared/others/yup/translationsYup';
import 'express-async-errors';

import express from 'express';
import { routesBank } from './routes/routerBank';

import { errorHandling } from './shared/middlewares/error';
import { routesUser } from './routes/routerUser';
import { routesTransactions } from './routes/routerTransactions';

const server = express();

server.use(express.json());
server.use(routesBank, routesUser, routesTransactions);

server.use(errorHandling);
export default server;
