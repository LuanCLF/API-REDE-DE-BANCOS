import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { compareHashed } from '../../../shared/others/code/hasher';
import {
  genericErrorMessages,
  userErrorMessages,
} from '../../../shared/others/messages/messages';

export const Delete = async (userID: number, password: string) => {
  console.log(userID);
  const user = await prisma.user.findUnique({
    select: {
      password: true,
      accounts: {
        select: {
          number: true,
        },
      },
    },
    where: {
      id: userID,
    },
  });

  if (!user) {
    throw new ApiError(userErrorMessages.userNotFound, 404);
  }

  const correct = await compareHashed(password, user?.password);
  if (!correct) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  await prisma.account.delete({
    where: {
      number: user.accounts[0].number,
    },
  });
  await prisma.user.delete({
    where: {
      id: userID,
    },
  });
};
