import { prisma } from '../../../../database/prismaClient';
import { ApiError } from '../../shared/middlewares/error';
import {
  bankErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';

import { CreateUserDto } from '../dtos/users.dtos';

export const CreateAccount = async (
  createUser: CreateUserDto
): Promise<void> => {
  const { number, agency, cpf, email, name, password, zipcode } = createUser;

  const bank = await prisma.bank.findUnique({
    select: {
      id: true,
    },
    where: {
      number,
      agency,
    },
  });

  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }
  const result = await prisma.user.findMany({
    select: {
      accounts: true,
    },
    where: {
      OR: [{ cpf, accounts: { some: { bank_id: bank.id } } }, { email }],
    },
  });

  if (result.length > 0) {
    throw new ApiError(userErrorMessages.userAlreadyExist, 409);
  }

  const user = await prisma.user.create({
    data: {
      cpf,
      email,
      name,
      password,
      zipcode,
      balance: 0,
    },
    select: {
      id: true,
    },
  });

  await prisma.account.create({
    data: {
      bank_id: bank.id,
      user_id: user.id,
    },
  });
};
