import { passwordBankJWT } from '../../conttrollers/shared/jwt/passwords';
import { ApiError } from '../../conttrollers/shared/middlewares/error';
import { compareHashed } from '../../conttrollers/shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../conttrollers/shared/others/messages/messages';
import jwt from 'jsonwebtoken';
import { BankRepository } from '../repositories/bank.repository';

export const login = async (
  passwordToCompare: string,
  number: string,
  agency: string
): Promise<string> => {
  const bankRepository = new BankRepository();
  const bank = await bankRepository.findWithNumberAndAgency(number, agency);

  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const { password, id } = bank;

  const correctPassword: boolean = await compareHashed(
    passwordToCompare,
    password
  );

  if (!correctPassword) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const tokenBank = jwt.sign({ id }, passwordBankJWT, {
    expiresIn: '1h',
  });

  return tokenBank;
};
