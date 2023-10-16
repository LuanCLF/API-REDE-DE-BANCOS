import { prisma } from '../../database/prismaClient';

import { CreateBankDto, UpdateBankDto } from '../../dtos/banks/banks.dtos';
import {
  IBank,
  IBankAccounts,
  IBankID,
} from '../../entities/bank/bank.entities';

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

  async update(id: number, updateBankDto: UpdateBankDto): Promise<void> {
    await prisma.bank.update({
      where: {
        id,
      },
      data: {
        ...updateBankDto,
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

  async getAccountsOfBank(id: number): Promise<IBankAccounts | null> {
    const bank = await prisma.bank.findUnique({
      where: {
        id,
      },
      select: {
        accounts: true,
      },
    });

    return bank;
  }

  async findWithID(id: number): Promise<IBank | null> {
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

  async checkIfExistWithNumberOrAgency(
    number: string | undefined,
    agency: string | undefined
  ): Promise<boolean> {
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

    return !!bank;
  }

  async findWithNumberAndAgency(
    number: string,
    agency: string
  ): Promise<IBankID | null> {
    const bank = await prisma.bank.findFirst({
      select: {
        id: true,
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
