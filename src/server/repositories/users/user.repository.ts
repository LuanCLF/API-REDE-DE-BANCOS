import { prisma } from '../../database/prismaClient';
import { CreateUserDto, UpdateUserDto } from '../../dtos/users/users.dtos';
import {
  IAccount,
  IAccountInformation,
  IAccountLogin,
  IAccountNumber,
  IAcountCreate,
} from '../../entities/user/user.entities';

class UserRepository {
  private async deleteAccount(accountNumber: number): Promise<void> {
    await prisma.account.delete({
      where: {
        number: accountNumber,
      },
    });
  }

  async delete(userID: number, accountNumber: number): Promise<void> {
    await this.deleteAccount(accountNumber);

    await prisma.user.delete({
      where: {
        id: userID,
      },
    });
  }

  async create(createUser: IAcountCreate, bankID: number): Promise<void> {
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

  async update(userID: number, updateUserDto: UpdateUserDto): Promise<void> {
    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        ...updateUserDto,
        accounts: {
          updateMany: {
            where: {
              user_id: userID,
            },
            data: {
              updated_at: new Date(),
            },
          },
        },
      },
    });
  }

  async myAccountInformation(
    userID: number
  ): Promise<IAccountInformation | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        cpf: true,
        email: true,
        name: true,
        phone_number: true,
        zipcode: true,
        balance: true,
        accounts: {
          select: {
            bank_id: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    return user;
  }

  async findBankIdOfMyAccount(userID: number): Promise<number | undefined> {
    const bankID = await prisma.account.findFirst({
      select: {
        bank_id: true,
      },
      where: {
        user_id: userID,
      },
    });

    return bankID?.bank_id;
  }

  async findAccounts(
    cpf: string,
    email: string,
    bankID: number
  ): Promise<IAccount | null> {
    const result = await prisma.user.findFirst({
      select: {
        accounts: true,
      },
      where: {
        OR: [{ cpf, accounts: { some: { bank_id: bankID } } }, { email }],
      },
    });

    return result;
  }

  async findUserForLogin(
    cpf: string,
    number: string,
    agency: string
  ): Promise<IAccountLogin | undefined> {
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

  async findWithID(
    userID: number
  ): Promise<{ password: string; accounts: Array<IAccountNumber> } | null> {
    const user = await prisma.user.findUnique({
      select: {
        password: true,
        accounts: {
          select: {
            number: true,
          },
        },
      },
      where: {
        id: userID,
      },
    });

    return user;
  }

  async checkIfUserAlreadyExistWithCpf(
    cpf: string,
    bankID: number
  ): Promise<boolean> {
    const result = await prisma.user.count({
      where: {
        accounts: {
          some: {
            bank_id: bankID,
          },
        },
        cpf,
      },
    });
    return !!result;
  }

  async checkIfUserAlreadyExistWithEmail(email: string): Promise<boolean> {
    const result = await prisma.user.count({
      where: {
        email,
      },
    });
    return !!result;
  }
}

export { UserRepository };
