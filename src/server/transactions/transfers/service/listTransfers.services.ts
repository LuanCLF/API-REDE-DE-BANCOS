import { prisma } from '../../../../database/prismaClient';
import { dateFormat } from '../../../shared/others/code/dateFormat';

const fromMe = async (userID: number, page: number) => {
  let mySelf = await prisma.account.findMany({
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

  const transfers = mySelf[0].transfersFrom.map((transfers) => {
    const { date: dateDeposit, ...rest } = transfers;

    return {
      ...rest,
      date: dateFormat(dateDeposit),
    };
  });

  return transfers;
};

const fromOut = async (userID: number, page: number) => {
  let outPerson = await prisma.account.findMany({
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

  const transfers = outPerson[0].transfersTo.map((transfers) => {
    const { date: dateDeposit, ...rest } = transfers;

    return {
      ...rest,
      date: dateFormat(dateDeposit),
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
