import express from 'express';

import { bank } from '../bank';
import { midValidation } from '../bank/controllers/controllers.banks';

const routesBank = express();

routesBank.get('/banks');
routesBank.post('/bank', midValidation, bank.registerBank);

routesBank.post('/login/bank', bank.loginBank);

routesBank.use(bank.midBankLogin);
routesBank.get('/bank', bank.searchMyBank);
routesBank.get('/bank/accounts', bank.getAllAccountsOfMyBank);
routesBank.patch('/bank', bank.midUpdateBank, bank.updateDataBank);
routesBank.delete('/bank', bank.deleteBank);

export { routesBank };
