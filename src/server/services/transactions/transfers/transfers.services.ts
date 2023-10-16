import { TransferRepository } from '../../../repositories/transation/transfers/transfer.repository';
import { ApiError } from '../../../shared/middlewares/error';
import { transferErrorMessage } from '../../../shared/others/messages/messages';
import { Deposit } from '../deposits/deposit.services';
import { Withdrawal } from '../withdrawals/withdrawal.services';

const userOriginBalance = async (
  userID: number,
  value: number
): Promise<void> => {
  const transferRepository = new TransferRepository();

  const userBalance = await transferRepository.getUserBalance(userID);

  if (!userBalance || userBalance.balance < value) {
    throw new ApiError(transferErrorMessage.lessThanNecessary, 401);
  }
};

const userDestiny = async (user: number, email: string): Promise<number> => {
  const transferRepository = new TransferRepository();
  const userDestiny = await transferRepository.getUserDestiny(user, email);

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

  const transferRepository = new TransferRepository();

  await transferRepository.transfer(
    new Date(),
    value,
    from.account.accountNumber,
    to.account.accountNumber
  );

  return {
    from,
    to,
  };
};
