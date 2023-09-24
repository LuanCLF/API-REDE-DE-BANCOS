import express from 'express';

import { bank } from '../bank';

const routesBank = express();

routesBank.get('/banks');
routesBank.post('/bank', bank.midBankRegister, bank.registerBank);

routesBank.post('/login/bank', bank.loginBank);

routesBank.use(bank.midBankLogin);
routesBank.get('/bank', bank.searchMyBank);
routesBank.get('/bank/accounts', bank.getAllAccountsOfMyBank);
routesBank.patch('/bank', bank.midUpdateBank, bank.updateDataBank);
routesBank.delete('/bank', bank.deleteBank);

export { routesBank };
