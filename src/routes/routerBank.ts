import express from 'express';
import {
  deleteBank,
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
routesBank.post('/bank', midBankRegister, registerBank);
routesBank.post('/login/bank', loginBank);

routesBank.use(midBankLogin);
routesBank.get('/bank/accounts', getAllAccounts);
routesBank.patch('/bank', midUpdateBank, updateDataBank);
routesBank.delete('/bank', deleteBank);

export { routesBank };
