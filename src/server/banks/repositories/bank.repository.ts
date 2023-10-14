import { prisma } from '../../../database/prismaClient';

import { CreateBankDto } from '../dtos/banks.dtos';
import { IBank } from '../entities/bank.entities';

class BankRepository {
  async register(createBankDto: CreateBankDto): Promise<void> {
    await prisma.bank.create({
      data: {
        ...createBankDto,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.bank.delete({
      where: {
        id,
      },
    });
  }

  async update(id: number, values: CreateBankDto): Promise<void> {
    await prisma.bank.update({
      where: {
        id,
      },
      data: {
        ...values,
        updated_at: new Date(),
      },
    });
  }

  async getAllBanks(): Promise<Array<IBank>> {
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
  }

  async getPassword(id: number): Promise<string | undefined> {
    const bank = await prisma.bank.findUnique({
      where: {
        id,
      },
      select: {
        password: true,
      },
    });

    return bank?.password;
  }

  async getAccountsOfBank(id: number) {
    const bank = await prisma.bank.findUnique({
      where: {
        id,
      },
      select: {
        accounts: true,
      },
    });

    return bank?.accounts;
  }

  async findWithID(id: number): Promise<Partial<IBank> | null> {
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
    return bank;
  }

  async findWithNumberOrAgency(
    number: string,
    agency: string
  ): Promise<{ id: number } | null> {
    const bank = await prisma.bank.findFirst({
      select: {
        id: true,
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

    return bank;
  }

  async findWithNumberAndAgency(
    number: string,
    agency: string
  ): Promise<{ id: number; password: string } | null> {
    const bank = await prisma.bank.findFirst({
      select: {
        id: true,
        password: true,
      },

      where: {
        number,
        agency,
      },
    });

    return bank;
  }
}

export { BankRepository };
