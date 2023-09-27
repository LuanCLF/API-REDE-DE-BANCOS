import './utils/translationsYup';

import express from 'express';
import { routesBank } from './routes/routerBank';
import { routesUser } from './routes/routerUser';
import { portBank, portUser } from './enviroment/env';

const appBank = express();
const appUser = express();

appBank.use(express.json());
appBank.use(routesBank);

appUser.use(express.json());
appUser.use(routesUser);

appBank.listen(portBank || 5000, () => {
  console.log(`Servidor do banco rodando na porta ${portBank}`);
});
appUser.listen(portUser || 6000, () => {
  console.log(`Servidor do usuário rodando na porta ${portUser}`);
});
