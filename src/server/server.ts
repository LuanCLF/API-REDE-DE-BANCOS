import './conttrollers/shared/others/yup/translationsYup';
import 'express-async-errors';

import express from 'express';
import { routesBank } from './routes/routerBank';

import { errorHandling } from './conttrollers/shared/middlewares/error';
import { routesUser } from './routes/routerUser';

const allRoutes = express();

allRoutes.use(express.json());
allRoutes.use(routesBank, routesUser);

allRoutes.use(errorHandling);
export { allRoutes };
