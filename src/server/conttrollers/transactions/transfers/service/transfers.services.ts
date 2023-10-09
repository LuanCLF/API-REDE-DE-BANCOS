import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { transferErrorMessage } from '../../../shared/others/messages/messages';
import { Deposit } from '../../deposits/service/deposit.services';
import { Withdrawal } from '../../withdrawals/service/withdrawal.services';

const userOriginBalance = async (
  userID: number,
  value: number
): Promise<number> => {
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

  return userBalance.balance;
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

  console.log(userDestiny);
  return userDestiny.id;
};

export const Transfer = async (
  userID: number,
  value: number,
  toUserID: number,
  toEmail: string
) => {
  const destinyID = await userDestiny(toUserID, toEmail);

  if (destinyID === userID) {
    throw new ApiError(transferErrorMessage.sameUser, 400);
  }

  const from = await Withdrawal(userID, value);
  const to = await Deposit(destinyID, value);

  return {
    from,
    to,
  };
};
