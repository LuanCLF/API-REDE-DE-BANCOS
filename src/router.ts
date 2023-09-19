import express from 'express';
import {
  getAllAccounts,
  registerBank,
} from './controllers/bank/bankController';
import { midBankRegister } from './middlewares/banks/middlewareBanks';
import {
  createAccountUser,
  loginUser,
} from './controllers/users/userController';
import { midCreateUser } from './middlewares/users/middlewareUsers';

const routes = express();

routes.post('/banks', midBankRegister, registerBank);
routes.post('/bankAccounts', getAllAccounts);

routes.post('/accounts', midCreateUser, createAccountUser);
routes.post('/login', loginUser);

routes.get('/home-page', (req, res) => {
  res.send('ta logado caraaaaaaaaaaaaaaaaaaaaaaio');
});
export { routes };
