import { prisma } from '../../../../database/prismaClient';
import { ApiError } from '../../shared/middlewares/error';
import { hasher } from '../../shared/others/code/hasher';
import {
  bankErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';
import { CreateUser } from '../dtos/users.dtos';

export class userService {
  private async searchBank(number: string, agency: string): Promise<number> {
    const bank = await prisma.bank.findUnique({
      select: {
        id: true,
      },
      where: {
        number,
        agency,
      },
    });

    if (!bank) {
      throw new ApiError(bankErrorMessages.bankNotFound, 404);
    }

    return bank.id;
  }

  public async create(createUser: CreateUser): Promise<void> {
    const { number, agency, cpf, email, name, password, zipcode } = createUser;
    const bank_id = await this.searchBank(number, agency);

    const result = await prisma.user.findMany({
      select: {
        accounts: true,
      },
      where: {
        email,
      },
    });
    const exist = result.some((obj) => {
      return obj.accounts[0].bank_id === bank_id;
    });

    if (exist) {
      throw new ApiError(userErrorMessages.userAlreadyExist, 409);
    }

    const passwordHashed = await hasher(password);

    const user = await prisma.user.create({
      data: {
        cpf,
        email,
        name,
        password: passwordHashed,
        balance: 0,
      },
      select: {
        id: true,
      },
    });

    await prisma.account.create({
      data: {
        bank_id,
        user_id: user.id,
        zipcode,
      },
    });
  }
}
