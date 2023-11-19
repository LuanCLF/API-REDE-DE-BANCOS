import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.deposit.deleteMany(),
    prisma.withdrawal.deleteMany(),
    prisma.transfer.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.bank.deleteMany(),
    prisma.address.deleteMany(),
  ]);
};
