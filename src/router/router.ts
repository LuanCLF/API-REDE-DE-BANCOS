import express from 'express';
import { getAllAccounts, registerBank } from '../controllers/bank/bank';
import { midBankFields } from '../middlewares/banks/middlewareBanks';
import { createAccount } from '../controllers/users/user';
import { midCreateUser } from '../middlewares/users/middlewareUsers';

const routes = express();

routes.post('/banks', midBankFields, registerBank);
routes.post('/bankAccounts', getAllAccounts);

routes.post('/accounts', midCreateUser, createAccount);

export { routes };
