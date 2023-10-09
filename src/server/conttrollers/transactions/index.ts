import { deposit } from './deposits/controller/deposits';
import { withdrawal } from './withdrawals/controller/withdrawals';
import { validationValue } from './validationDepositOrWithdrawals';
import { tranferValidation, transfer } from './transfers/controller/transfers';

export const transaction = {
  validationValue,
  deposit,
  withdrawal,
  tranferValidation,
  transfer,
};
