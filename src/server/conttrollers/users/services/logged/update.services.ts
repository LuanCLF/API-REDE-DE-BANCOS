import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { genericErrorMessages } from '../../../shared/others/messages/messages';
import { UpdateUserDto } from '../../dtos/users.dtos';

export const Update = async (id: number, updateUserDto: UpdateUserDto) => {
  let { cpf, email } = updateUserDto;

  const bank = await prisma.bank.findMany({
    select: {
      id: true,
    },
    where: {
      accounts: {
        some: {
          user_id: id,
        },
      },
    },
  });

  if (cpf) {
    const result = await prisma.user.count({
      where: {
        accounts: {
          some: {
            bank_id: bank[0].id,
          },
        },
        cpf,
      },
    });
    console.log('result cpf', result);
    if (result !== 0) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }
  }
  if (email) {
    const result = await prisma.user.count({
      where: {
        email,
      },
    });
    console.log('result email', result);

    if (result !== 0) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }
  }
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...updateUserDto,
      accounts: {
        updateMany: {
          where: {
            user_id: id,
          },
          data: {
            updated_at: new Date(),
          },
        },
      },
    },
  });
};
