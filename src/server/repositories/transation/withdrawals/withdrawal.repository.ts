import { prisma } from '../../../../database/prisma';

import {
  IWithdrawalBalance,
  IWithdrawalUserUpdate,
  IWithdrawalsArray,
} from '../../../entities/transaction/withdrawals/withdrawal.entities';

class WithdrawalRepository {
  async userUpdateBalance(
    userID: number,
    value: number
  ): Promise<IWithdrawalUserUpdate> {
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

    return user;
  }

  async registerWithdrawal(
    account_number: number,
    value: number,
    date: Date
  ): Promise<void> {
    await prisma.withdrawal.create({
      data: {
        account_number,
        value,
        date,
      },
    });
  }

  async listWithdrawals(
    userID: number,
    page: number
  ): Promise<IWithdrawalsArray> {
    const withdrawalsArray = await prisma.account.findMany({
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

    return withdrawalsArray[0];
  }

  async getUserBalance(userID: number): Promise<IWithdrawalBalance | null> {
    const userBalance = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        balance: true,
      },
    });
    return userBalance;
  }
}

export { WithdrawalRepository };
