import './conttrollers/shared/others/yup/translationsYup';
import 'express-async-errors';
import { config } from 'dotenv';
config();

import express from 'express';
import { routesBank } from './routes/routerBank';
import { errorHandling } from './conttrollers/shared/middlewares/error';

const allRoutes = express();

allRoutes.use(express.json());
allRoutes.use(routesBank);

allRoutes.use(errorHandling);
export { allRoutes };
