import express from 'express';
import { transaction } from '../conttrollers/transactions';
import { midUserLogin } from '../conttrollers/shared/middlewares/authentication/user.authentication';
import { listValidation } from '../conttrollers/transactions/utils/listValidation';

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

routesTransactions.use('/transaction', listValidation);

routesTransactions.get('/transaction/deposits', transaction.listDeposits);
routesTransactions.get('/transaction/withdrawals', transaction.listWithdrawals);
routesTransactions.get('/transaction/transfers', transaction.listTransfers);

export { routesTransactions };
