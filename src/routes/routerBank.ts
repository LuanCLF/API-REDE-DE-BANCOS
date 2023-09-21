import express from 'express';
import {
  getAllAccounts,
  loginBank,
  updateDataBank,

  // updateDataBank,
} from '../controllers/bank/bankController';
import {
  midBankRegister,
  midUpdateBank,
} from '../middlewares/banks/middlewareBanks';
import { registerBank } from '../controllers/bank/bankController';
import { midBankLogin } from '../middlewares/banks/middlewareBanks';

const routesBank = express();
routesBank.post('/banks', midBankRegister, registerBank);
routesBank.post('/login/bank', loginBank);

routesBank.use(midBankLogin);

routesBank.get('/bankAccounts', getAllAccounts);
routesBank.patch('/bank', midUpdateBank, updateDataBank);

export { routesBank };
