import { prisma } from '../../../../../database/prismaClient';

export const Deposit = async (userID: number, value: number) => {
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
    data: {
      balance: {
        increment: value,
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
    where: {
      id: userID,
    },
  });

  const { balance, accounts, ...rest } = user;

  await prisma.deposit.create({
    data: {
      account_number: accounts[0].number,
      value,
      date: new Date(),
    },
  });

  const userFormat = {
    account: { accountNumber: accounts[0].number, bank: accounts[0].bank },
    user: rest,

    balance: Number(user.balance).toFixed(2),
  };
  return userFormat;
};
