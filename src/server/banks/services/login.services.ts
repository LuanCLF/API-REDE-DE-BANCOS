import { passwordBankJWT } from '../../shared/jwt/passwords';
import { ApiError } from '../../shared/middlewares/error';
import { compareHashed } from '../../shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../shared/others/messages/messages';
import jwt from 'jsonwebtoken';
import { BankRepository } from '../repository/bank.repository';

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
  const { id } = bank;

  const password = (await bankRepository.getPassword(id)) || '';

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
