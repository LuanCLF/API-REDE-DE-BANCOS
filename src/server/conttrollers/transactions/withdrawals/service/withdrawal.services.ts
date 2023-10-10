import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { withdrawalErrorMessage } from '../../../shared/others/messages/messages';

export const Withdrawal = async (userID: number, value: number) => {
  const userBalance = await prisma.user.findUnique({
    where: {
      id: userID,
    },
    select: {
      balance: true,
    },
  });

  if (!userBalance || userBalance.balance < value) {
    throw new ApiError(withdrawalErrorMessage.lessThanNecessary, 401);
  }

  const user = await prisma.user.update({
    select: {
      cpf: true,
      name: true,
      balance: true,
      accounts: {
        select: {
          number: true,

          bank: {
            select: {
              agency: true,
              number: true,
            },
          },
        },
      },
    },
    where: {
      id: userID,
    },
    data: {
      balance: {
        decrement: value,
      },
      accounts: {
        updateMany: {
          data: {
            updated_at: new Date(),
          },
          where: {
            user_id: userID,
          },
        },
      },
    },
  });

  const { balance, accounts, ...rest } = user;

  await prisma.withdrawal.create({
    data: {
      account_number: accounts[0].number,
      value,
      date: new Date(),
    },
  });

  const userFormat = {
    account: { accountNumber: accounts[0].number, bank: accounts[0].bank },
    user: rest,
    previousBalance: Number(userBalance.balance).toFixed(2),
    currentBalance: Number(user.balance).toFixed(2),
  };

  return userFormat;
};
