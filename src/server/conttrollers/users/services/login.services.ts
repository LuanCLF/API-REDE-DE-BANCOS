import { prisma } from '../../../../database/prismaClient';
import { passwordUserJWT } from '../../shared/jwt/passwords';
import { ApiError } from '../../shared/middlewares/error';
import { compareHashed } from '../../shared/others/code/hasher';
import {
  genericErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';
import jwt from 'jsonwebtoken';

export const Login = async (
  number: string,
  agency: string,
  cpf: string,
  password: string
): Promise<string> => {
  const bank = await prisma.account.findMany({
    select: {
      user: {
        select: {
          id: true,
          password: true,
        },
      },
    },
    where: {
      user: {
        cpf,
      },
      bank: {
        number,
        agency,
      },
    },
  });
  if (bank.length < 1) {
    throw new ApiError(userErrorMessages.userNotFound, 404);
  }
  const { password: passwordHashed, id } = bank[0].user;

  const correct = await compareHashed(password, passwordHashed);

  if (!correct) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const token = jwt.sign({ id }, passwordUserJWT, { expiresIn: '1h' });

  return token;
};
