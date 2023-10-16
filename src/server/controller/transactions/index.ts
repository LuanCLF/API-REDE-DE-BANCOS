import { deposit } from './deposits/deposits';
import { withdrawal } from './withdrawals/withdrawals';
import { validationValue } from './utils/validationDepositOrWithdrawals';

import { tranferValidation, transfer } from './transfers/transfers';

import { listValidation } from './utils/listValidation';
import { listDeposits } from './deposits/listDeposits';
import { listTransfers } from './transfers/listTransfers';
import { listWithdrawals } from './withdrawals/listWithdrawals';

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
