import { prisma } from '../../../../database/prisma';
import {
  ITransferBalance,
  ITransferUserDestiny,
  ITransfersListFromMe,
  ITransfersListToMe,
} from '../../../entities/transaction/transfers/transfer.entities';

class TransferRepository {
  async transfer(
    date: Date,
    value: number,
    account_origin_number: number,
    account_destiny_number: number
  ): Promise<void> {
    await prisma.transfer.create({
      data: {
        date,
        value,
        account_origin_number,
        account_destiny_number,
      },
    });
  }

  async getTransfersFromMe(
    userID: number,
    page: number
  ): Promise<ITransfersListFromMe> {
    let fromMe = await prisma.account.findMany({
      where: {
        user_id: userID,
      },
      select: {
        transfersFrom: {
          skip: page * 10,
          take: 10,
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    return fromMe[0];
  }

  async getTransfersToMe(
    userID: number,
    page: number
  ): Promise<ITransfersListToMe> {
    const toMe = await prisma.account.findMany({
      where: {
        user_id: userID,
      },
      select: {
        transfersTo: {
          skip: page * 10,
          take: 10,
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    return toMe[0];
  }

  async getUserDestiny(
    userID: number,
    email: string
  ): Promise<ITransferUserDestiny | null> {
    const userDestiny = await prisma.user.findFirst({
      where: {
        OR: [{ id: userID }, { email }],
      },
      select: {
        id: true,
      },
    });

    return userDestiny;
  }

  async getUserBalance(userID: number): Promise<ITransferBalance | null> {
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

export { TransferRepository };
