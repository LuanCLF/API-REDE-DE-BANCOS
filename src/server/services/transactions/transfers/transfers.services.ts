import { prisma } from '../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { transferErrorMessage } from '../../../shared/others/messages/messages';
import { Deposit } from '../deposits/deposit.services';
import { Withdrawal } from '../withdrawals/withdrawal.services';

const userOriginBalance = async (
  userID: number,
  value: number
): Promise<void> => {
  const userBalance = await prisma.user.findUnique({
    where: {
      id: userID,
    },
    select: {
      balance: true,
    },
  });

  if (!userBalance || userBalance.balance < value) {
    throw new ApiError(transferErrorMessage.lessThanNecessary, 401);
  }
};

const userDestiny = async (user: number, email: string): Promise<number> => {
  const userDestiny = await prisma.user.findFirst({
    where: {
      OR: [{ id: user }, { email: email }],
    },
    select: {
      id: true,
    },
  });

  if (!userDestiny) {
    throw new ApiError(transferErrorMessage.recipientNotFound, 404);
  }

  return userDestiny.id;
};

export const Transfer = async (
  userID: number,
  value: number,
  toUserID: number,
  toEmail: string
) => {
  await userOriginBalance(userID, value);

  const destinyID = await userDestiny(toUserID, toEmail);

  if (destinyID === userID) {
    throw new ApiError(transferErrorMessage.sameUser, 400);
  }

  const from = await Withdrawal(userID, value);
  const to = await Deposit(destinyID, value);

  await prisma.transfer.create({
    data: {
      date: new Date(),
      value,
      account_origin_number: from.account.accountNumber,
      account_destiny_number: to.account.accountNumber,
    },
  });

  return {
    from,
    to,
  };
};
