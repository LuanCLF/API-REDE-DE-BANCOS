import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { bankErrorMessages } from '../../../shared/others/messages/messages';
import { IBank } from '../../entities/bank.entities';

export const GetMyBank = async (id: number): Promise<IBank> => {
  const bank = await prisma.bank.findUnique({
    where: { id },
    select: {
      name: true,
      number: true,
      agency: true,
      zipcode: true,
      created_at: true,
    },
  });
  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  return bank;
};
