import './utils/translationsYup';

import express from 'express';
import { routesBank } from './routes/routerBank';
import { routesUser } from './routes/routerUser';

const appBank = express();
const appUser = express();

appBank.use(express.json());
appBank.use(routesBank);

appUser.use(express.json());
appUser.use(routesUser);

appBank.listen(6023);
appUser.listen(3000);
