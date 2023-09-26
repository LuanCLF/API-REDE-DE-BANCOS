import express from 'express';

import { bank } from '../bank/index';
import { midBankLogin } from '../bank/middlewares/middlewares.banks';

const routesBank = express();

routesBank.post('/bank', bank.registerValidation, bank.registerBank);
routesBank.post('/bank/login', bank.loginValidation, bank.loginBank);

routesBank.use(midBankLogin);
routesBank.get('/bank', bank.searchMyBank);
routesBank.get('/bank/accounts', bank.getAllAccountsOfMyBank);
routesBank.patch('/bank', bank.updateValidation, bank.update);
routesBank.delete('/bank', bank.deleteValidation, bank.deleteBank);

export { routesBank };
