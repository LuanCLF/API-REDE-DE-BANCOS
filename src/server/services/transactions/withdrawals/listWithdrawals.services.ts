import { WithdrawalRepository } from '../../../repositories/transation/withdrawals/withdrawal.repository';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const ListWithdrawals = async (userID: number, page: number) => {
  const withdrawalRepository = new WithdrawalRepository();

  const { withdrawals } = await withdrawalRepository.listWithdrawals(
    userID,
    page
  );

  const withdrawalsFormated = withdrawals.map((withdrawal) => {
    const { date: dateWithdrawal, ...rest } = withdrawal;

    return {
      ...rest,
      date: dateFormat(dateWithdrawal),
    };
  });

  return { page, withdrawalsFormated };
};
