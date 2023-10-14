import { prisma } from '../../../../database/prismaClient';
import { ApiError } from '../../../conttrollers/shared/middlewares/error';
import { compareHashed } from '../../../conttrollers/shared/others/code/hasher';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../conttrollers/shared/others/messages/messages';

export const Delete = async (
  id: number,
  passwordToCompare: string
): Promise<void> => {
  const bank = await prisma.bank.findUnique({
    where: {
      id,
    },
    select: {
      password: true,
      accounts: true,
    },
  });
  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const { password, accounts } = bank;

  const correctPassword = await compareHashed(passwordToCompare, password);
  if (!correctPassword) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  if (accounts.length > 0) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await prisma.bank.delete({
    where: {
      id,
    },
  });
};
