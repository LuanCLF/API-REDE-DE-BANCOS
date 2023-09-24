import express from 'express';

import { bankControllers } from '../bank';

const routesBank = express();
routesBank.post(
  '/bank',
  bankControllers.midBankRegister,
  bankControllers.registerBank
);
routesBank.post('/login/bank', bankControllers.loginBank);

routesBank.use(bankControllers.midBankLogin);
routesBank.get('/bank', bankControllers.searchBank);
routesBank.get('/bank/accounts', bankControllers.getAllAccounts);
routesBank.patch(
  '/bank',
  bankControllers.midUpdateBank,
  bankControllers.updateDataBank
);
routesBank.delete('/bank', bankControllers.deleteBank);

export { routesBank };
