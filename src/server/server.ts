import './utils/translationsYup';

import { config } from 'dotenv';
config();

import express from 'express';
import { routesBank } from './routes/routerBank';
import { routesUser } from './routes/routerUser';

const allRoutes = express();

allRoutes.use(express.json());
allRoutes.use(routesBank);

export { allRoutes };
