import { prisma } from '../../../../database/prisma';
import {
  IDepositArray,
  IDepositUserUpdate,
} from '../../../entities/transaction/deposits/deposit.entities';

class DepositRepository {
  async userUpdateBalance(
    userID: number,
    value: number
  ): Promise<IDepositUserUpdate> {
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
    return user;
  }

  async registerDeposit(
    account_number: number,
    value: number,
    date: Date
  ): Promise<void> {
    await prisma.deposit.create({
      data: {
        account_number,
        value,
        date,
      },
    });
  }

  async listDeposits(userID: number, page: number): Promise<IDepositArray> {
    const depositsArray = await prisma.account.findMany({
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

    return depositsArray[0];
  }
}

export { DepositRepository };
