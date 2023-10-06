import { prisma } from '../../../../database/prismaClient';
import { ApiError } from '../../shared/middlewares/error';

import {
  bankErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';
import { CreateUserDto } from '../dtos/users.dtos';

const searchBank = async (number: string, agency: string): Promise<number> => {
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

  return bank.id;
};

export const createAccount = async (
  createUser: CreateUserDto
): Promise<void> => {
  const { number, agency, cpf, email, name, password, zipcode } = createUser;
  const bank_id = await searchBank(number, agency);

  const result = await prisma.user.findMany({
    select: {
      accounts: true,
    },
    where: {
      OR: [{ email }, { cpf }],
    },
  });
  const exist = result.some((obj) => {
    return obj.accounts[0].bank_id === bank_id;
  });

  if (exist) {
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
      bank_id,
      user_id: user.id,
    },
  });
};
