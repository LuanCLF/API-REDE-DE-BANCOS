import { prisma } from '../../../database/prismaClient';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const ListWithdrawals = async (userID: number, page: number) => {
  let withdrawalsArray = await prisma.account.findMany({
    where: {
      user_id: userID,
    },
    select: {
      withdrawals: {
        skip: page * 10,
        take: 10,
        orderBy: {
          id: 'desc',
        },
      },
    },
  });

  const withdrawals = withdrawalsArray[0].withdrawals.map((withdrawal) => {
    const { date: dateWithdrawal, ...rest } = withdrawal;

    return {
      ...rest,
      date: dateFormat(dateWithdrawal),
    };
  });

  return { page, withdrawals };
};
