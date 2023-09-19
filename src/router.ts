import express from 'express';
import {
  getAllAccounts,
  registerBank,
} from './controllers/bank/bankController';
import { midBankRegister } from './middlewares/banks/middlewareBanks';
import { createAccountUser } from './controllers/users/userController';
import { midCreateUser } from './middlewares/users/middlewareUsers';

const routes = express();

routes.post('/banks', midBankRegister, registerBank);
routes.post('/bankAccounts', getAllAccounts);

routes.post('/accounts', midCreateUser, createAccountUser);

export { routes };
