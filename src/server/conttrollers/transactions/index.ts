import { deposit } from './deposits/controller/deposits';
import { withdrawal } from './withdrawals/controller/withdrawals';
import { validationValue } from './utils/validationDepositOrWithdrawals';
import { tranferValidation, transfer } from './transfers/controller/transfers';
import { listValidation } from './utils/listValidation';
import { listDeposits } from './deposits/controller/listDeposits';
import { listTransfers } from './transfers/controller/listTransfers';
import { listWithdrawals } from './withdrawals/controller/listWithdrawals';

export const transaction = {
  validationValue,
  deposit,
  withdrawal,
  tranferValidation,
  transfer,
  listValidation,
  listDeposits,
  listTransfers,
  listWithdrawals,
};
