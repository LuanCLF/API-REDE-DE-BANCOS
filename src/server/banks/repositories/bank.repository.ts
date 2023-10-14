import { prisma } from '../../../database/prismaClient';
import { IBank } from '../../conttrollers/banks/entities/bank.entities';
import { CreateBankDto } from '../dtos/banks.dtos';

class BankRepository {
  async register(createBankDto: CreateBankDto): Promise<void> {
    await prisma.bank.create({
      data: {
        ...createBankDto,
      },
    });
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
}

export { BankRepository };
