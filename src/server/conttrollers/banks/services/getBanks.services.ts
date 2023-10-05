import { prisma } from '../../../../database/prismaClient';
import { IBank } from '../entities/bank.entities';

export const GetBanks = async (): Promise<Array<IBank>> => {
  const banks = await prisma.bank.findMany({
    select: {
      number: true,
      agency: true,
      name: true,
      created_at: true,
      zipcode: true,
    },
  });

  return banks;
};
