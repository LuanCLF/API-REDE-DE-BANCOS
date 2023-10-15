import { prisma } from '../../../database/prismaClient';
import { CreateUserDto } from '../dtos/users.dtos';

class UserRepository {
  async create(createUser: CreateUserDto, bankID: number): Promise<void> {
    const user = await prisma.user.create({
      data: {
        ...createUser,
        balance: 0,
      },
      select: {
        id: true,
      },
    });

    await prisma.account.create({
      data: {
        bank_id: bankID,
        user_id: user.id,
      },
    });
  }

  async findAccount(cpf: string, email: string, bankID: number) {
    const result = await prisma.user.findFirst({
      select: {
        accounts: true,
      },
      where: {
        OR: [{ cpf, accounts: { some: { bank_id: bankID } } }, { email }],
      },
    });

    return result?.accounts;
  }

  async findUserForLogin(
    cpf: string,
    number: string,
    agency: string
  ): Promise<{ id: number; password: string } | undefined> {
    const bank = await prisma.account.findFirst({
      select: {
        user: {
          select: {
            id: true,
            password: true,
          },
        },
      },
      where: {
        user: {
          cpf,
        },
        bank: {
          number,
          agency,
        },
      },
    });
    return bank?.user;
  }
}

export { UserRepository };
