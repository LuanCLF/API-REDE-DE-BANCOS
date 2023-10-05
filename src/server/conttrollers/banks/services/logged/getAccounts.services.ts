import { prisma } from '../../../../../database/prismaClient';
import { ApiError } from '../../../shared/middlewares/error';
import { bankErrorMessages } from '../../../shared/others/messages/messages';

export const GetAllAccounts = async (id: number) => {
  const bank = await prisma.bank.findUnique({
    where: { id },
    select: {
      name: true,
      number: true,
      agency: true,
      created_at: true,
      accounts: true,
    },
  });
  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  return bank;
};
