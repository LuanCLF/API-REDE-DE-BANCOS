import express from 'express';
import { transaction } from '../conttrollers/transactions';
import { midUserLogin } from '../conttrollers/shared/middlewares/authentication/user.authentication';

const routesTransactions = express();

routesTransactions.use('/transaction', midUserLogin);

routesTransactions.post(
  '/transaction/deposit',
  transaction.validationValue,
  transaction.deposit
);
routesTransactions.post(
  '/transaction/withdrawal',
  transaction.validationValue,
  transaction.withdrawal
);
routesTransactions.post(
  '/transaction/transfer',
  transaction.tranferValidation,
  transaction.transfer
);

export { routesTransactions };
