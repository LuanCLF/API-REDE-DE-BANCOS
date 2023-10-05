import { prisma } from '../../../../database/prismaClient';
import { passwordBankJWT } from '../../shared/jwt/passwords';
import { ApiError } from '../../shared/middlewares/error';
import { compareHashed } from '../../shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../shared/others/messages/messages';
import jwt from 'jsonwebtoken';

export const login = async (
  passwordToCompare: string,
  number: string,
  agency: string
): Promise<string> => {
  const bank = await prisma.bank.findFirst({
    select: {
      id: true,
      password: true,
    },

    where: {
      number,
      agency,
    },
  });

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
