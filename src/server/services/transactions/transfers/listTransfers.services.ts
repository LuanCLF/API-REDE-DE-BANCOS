import { prisma } from '../../../database/prismaClient';
import { TransferRepository } from '../../../repositories/transation/transfers/transfer.repository';
import { dateFormat } from '../../../shared/others/code/dateFormat';

const fromMe = async (userID: number, page: number) => {
  const transferRepository = new TransferRepository();

  const { transfersFrom } = await transferRepository.getTransfersFromMe(
    userID,
    page
  );

  const transfers = transfersFrom.map((transfers) => {
    const { date: dateDeposit, ...rest } = transfers;

    return {
      fromMe: { ...rest, date: dateFormat(new Date(dateDeposit)) },
    };
  });

  return transfers;
};

const fromOut = async (userID: number, page: number) => {
  const transferRepository = new TransferRepository();

  let { transfersTo } = await transferRepository.getTransfersToMe(userID, page);

  const transfers = transfersTo.map((transfers) => {
    const { date: dateDeposit, ...rest } = transfers;

    return {
      toMe: { ...rest, date: dateFormat(dateDeposit) },
    };
  });

  return transfers;
};

export const ListTransfers = async (
  userID: number,
  page: number,
  from: string
) => {
  let transfers = {};

  switch (from) {
    case 'out':
      transfers = await fromOut(userID, page);
      break;
    default:
      transfers = await fromMe(userID, page);
  }

  return { page, transfers };
};
