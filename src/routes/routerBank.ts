import express from 'express';
import {
  getAllAccounts,
  loginBank,

  // updateDataBank,
} from '../controllers/bank/bankController';
import { midBankRegister } from '../middlewares/banks/middlewareBanks';
import { registerBank } from '../controllers/bank/bankController';
import { midBankLogin } from '../middlewares/banks/middlewareBanks';

const routesBank = express();
routesBank.post('/banks', midBankRegister, registerBank);
routesBank.post('/login/bank', loginBank);

routesBank.use(midBankLogin);

routesBank.get('/bankAccounts', getAllAccounts);
// routes.patch('bank', updateDataBank);

export { routesBank };
