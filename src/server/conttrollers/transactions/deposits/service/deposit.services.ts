import { prisma } from '../../../../../database/prismaClient';

export const Deposit = async (userID: number, value: number) => {
  const user = await prisma.user.update({
    select: {
      cpf: true,
      name: true,
      balance: true,
    },
    data: {
      balance: {
        increment: value,
      },
    },
    where: {
      id: userID,
    },
  });

  const userFormat = {
    ...user,
    balance: Number(user.balance).toFixed(2),
  };
  return userFormat;
};
