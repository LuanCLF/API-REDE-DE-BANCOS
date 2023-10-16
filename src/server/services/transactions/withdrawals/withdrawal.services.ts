import { WithdrawalRepository } from '../../../repositories/transation/withdrawals/withdrawal.repository';

import { ApiError } from '../../../shared/middlewares/error';
import { withdrawalErrorMessage } from '../../../shared/others/messages/messages';

export const Withdrawal = async (userID: number, value: number) => {
  const withdrawalRepository = new WithdrawalRepository();
  const userBalance = await withdrawalRepository.getUserBalance(userID);

  if (!userBalance || userBalance.balance < value) {
    throw new ApiError(withdrawalErrorMessage.lessThanNecessary, 401);
  }

  const user = await withdrawalRepository.userUpdateBalance(userID, value);
  const { balance, accounts, ...rest } = user;

  await withdrawalRepository.registerWithdrawal(
    accounts[0].number,
    value,
    new Date()
  );
  const userFormat = {
    account: { accountNumber: accounts[0].number, bank: accounts[0].bank },
    user: rest,
    previousBalance: Number(userBalance.balance).toFixed(2),
    currentBalance: Number(user.balance).toFixed(2),
  };

  return userFormat;
};
