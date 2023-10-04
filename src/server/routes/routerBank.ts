import express from 'express';
import { midBankLogin } from '../conttrollers/shared/middlewares/authentication';
import { bank } from '../conttrollers/banks';

const routesBank = express();

routesBank.get('/banks', bank.getAllBanks);

routesBank.post('/bank', bank.registerValidation, bank.registerBank);
routesBank.post('/bank/login', bank.loginValidation, bank.loginBank);

routesBank.use('/bank', midBankLogin);

routesBank.get('/bank', bank.getMyBank);
routesBank.get('/bank/accounts', bank.getAllAccountsOfMyBank);

routesBank.put('/bank', bank.updateAllValidation, bank.update);

routesBank.patch('/bank', bank.updateSomeValidation, bank.update);

routesBank.delete('/bank', bank.deleteValidation, bank.deleteBank);

export { routesBank };
