import { prisma } from '../../../database/prismaClient';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const ListDeposits = async (userID: number, page: number) => {
  let depositsArray = await prisma.account.findMany({
    where: {
      user_id: userID,
    },
    select: {
      deposits: {
        skip: page * 10,
        take: 10,
        orderBy: {
          id: 'desc',
        },
      },
    },
  });

  const deposits = depositsArray[0].deposits.map((deposit) => {
    const { date: dateDeposit, ...rest } = deposit;

    return {
      ...rest,
      date: dateFormat(dateDeposit),
    };
  });

  return { page, deposits };
};
