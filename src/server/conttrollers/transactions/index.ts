import { deposit } from './deposits/controller/deposits';
import { withdrawal } from './withdrawals/controller/withdrawals';
import { validationValue } from './validationDepositOrWithdrawals';
export const transaction = {
  validationValue,
  deposit,
  withdrawal,
};
