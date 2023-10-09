import { prisma } from '../../../../../database/prismaClient';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const MyAccount = async (userID: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    },
    select: {
      cpf: true,
      email: true,
      name: true,
      phone_number: true,
      zipcode: true,
      balance: true,
      accounts: {
        select: {
          created_at: true,
          updated_at: true,
        },
      },
    },
  });
  if (user) {
    const balanceString = user?.balance.toString();
    const { accounts, ...rest } = user;
    const userFormated = {
      ...rest,
      balance: Number(balanceString),

      created_at: dateFormat(user?.accounts[0].created_at || new Date()),
      updated_at: dateFormat(user?.accounts[0].updated_at || new Date()),
    };

    return userFormated;
  }
};
