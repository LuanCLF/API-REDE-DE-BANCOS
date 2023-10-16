import { DepositRepository } from '../../../repositories/transation/deposits/deposit.repository';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const ListDeposits = async (userID: number, page: number) => {
  const depositRepository = new DepositRepository();

  let { deposits } = await depositRepository.listDeposits(userID, page);

  const depositsFormated = deposits.map((deposit) => {
    const { date: dateDeposit, ...rest } = deposit;

    return {
      ...rest,
      date: dateFormat(dateDeposit),
    };
  });

  return { page, depositsFormated };
};
