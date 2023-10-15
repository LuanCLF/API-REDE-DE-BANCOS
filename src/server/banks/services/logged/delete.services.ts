import { ApiError } from '../../../shared/middlewares/error';
import { compareHashed } from '../../../shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../shared/others/messages/messages';
import { BankRepository } from '../../repository/bank.repository';

export const Delete = async (
  id: number,
  passwordToCompare: string
): Promise<void> => {
  const bankRepository = new BankRepository();
  const password = await bankRepository.getPassword(id);

  if (!password) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const correctPassword = await compareHashed(
    passwordToCompare,
    String(password)
  );

  if (!correctPassword) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const bank = await bankRepository.getAccountsOfBank(id);
  const accounts = bank ? bank.accounts : false;
  if (accounts && accounts.length > 0) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await bankRepository.delete(id);
};
