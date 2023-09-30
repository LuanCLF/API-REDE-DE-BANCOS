import './utils/translationsYup';

import { config } from 'dotenv';
config();

import express from 'express';
import { routesBank } from './routes/routerBank';

const allRoutes = express();

allRoutes.use(express.json());
allRoutes.use(routesBank);

export { allRoutes };
