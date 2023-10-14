import { prisma } from '../../../../../database/prismaClient';
import { CreateBankDto } from '../../../../banks/dtos/banks.dtos';

export const Update = async (
  id: number,
  values: CreateBankDto
): Promise<void> => {
  await prisma.bank.update({
    where: {
      id,
    },
    data: {
      ...values,
      updated_at: new Date(),
    },
  });
};
