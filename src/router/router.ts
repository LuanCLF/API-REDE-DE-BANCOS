import express from 'express';
import { getAllAccounts, registerBank } from '../controllers/bank/bank';
import { midBankFields } from '../middlewares/banks/middlewareBanks';

const routes = express();

routes.post('/banks', midBankFields, registerBank);
routes.post('/accounts', getAllAccounts);

export { routes };
