import './utils/translationsYup';
import 'express-async-errors';
import { config } from 'dotenv';
config();

import express from 'express';
import { routesBank } from './routes/routerBank';
import { errorHandling } from './bank/middlewares/error';

const allRoutes = express();

allRoutes.use(express.json());
allRoutes.use(routesBank);

allRoutes.use(errorHandling);
export { allRoutes };
