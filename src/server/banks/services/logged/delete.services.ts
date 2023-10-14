import { ApiError } from '../../../conttrollers/shared/middlewares/error';
import { compareHashed } from '../../../conttrollers/shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../conttrollers/shared/others/messages/messages';
import { BankRepository } from '../../repositories/bank.repository';

export const Delete = async (
  id: number,
  passwordToCompare: string
): Promise<void> => {
  const bankRepository = new BankRepository();
  const password = await bankRepository.getPassword(id);
  const accounts = await bankRepository.getAccountsOfBank(id);

  if (!password) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const correctPassword = await compareHashed(passwordToCompare, password);

  if (!correctPassword) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }
  if (accounts.length > 0) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await bankRepository.delete(id);
};
