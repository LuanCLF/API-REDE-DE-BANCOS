import { prisma } from '../../../../database/prismaClient';
import { ApiError } from '../../shared/middlewares/error';
import { genericErrorMessages } from '../../shared/others/messages/messages';
import { CreateBankDto } from '../dtos/banks.dtos';

export const Register = async (createBankDto: CreateBankDto): Promise<void> => {
  const { number, agency, password, name, zipcode } = createBankDto;

  const exist = await prisma.bank.findFirst({
    select: {
      id: true,
      password: true,
    },

    where: {
      OR: [
        {
          number,
        },
        { agency },
      ],
    },
  });

  if (exist) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await prisma.bank.create({
    data: {
      number,
      agency,
      name,
      password,
      zipcode,
    },
  });
};
