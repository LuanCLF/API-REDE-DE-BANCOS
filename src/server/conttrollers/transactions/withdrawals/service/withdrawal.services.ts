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
    },
    where: {
      id: userID,
    },
    data: {
      balance: {
        decrement: value,
      },
    },
  });
  const userFormat = {
    ...user,
    balance: Number(user.balance).toFixed(2),
  };

  return userFormat;
};
