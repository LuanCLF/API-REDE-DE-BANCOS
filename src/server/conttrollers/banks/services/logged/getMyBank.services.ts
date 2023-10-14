import { prisma } from '../../../../../database/prismaClient';
import { IBank } from '../../../../banks/entities/bank.entities';
import { ApiError } from '../../../shared/middlewares/error';
import { bankErrorMessages } from '../../../shared/others/messages/messages';

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
