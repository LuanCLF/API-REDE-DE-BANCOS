import { ApiError } from '../middlewares/error';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../messages/messages';
import { passwordBankJWT } from '../../../enviroment/env';
import { CreateBankDto } from '../dtos/banks.dtos';
import { compareHashed, hasher } from '../../utils/hasher';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../database/prismaClient';
import { IBank, IBankValidate } from '../entities/bank.entities';

export class BankService {
  private async getBank(
    number: string,
    agency: string
  ): Promise<IBankValidate | null> {
    const exist = await prisma.bank.findFirst({
      select: {
        id: true,
        password: true,
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

    return exist;
  }

  public async getBanks(): Promise<Array<IBank>> {
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

  public async create(createBankDto: CreateBankDto): Promise<void> {
    const { number, agency, password, name, zipcode } = createBankDto;

    const exist = await this.getBank(number, agency);

    if (exist) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }

    const passwordHashed = await hasher(password);

    await prisma.bank.create({
      data: {
        number,
        agency,
        name,
        password: String(passwordHashed),
        zipcode,
      },
    });
  }

  public async login(
    passwordToCompare: string,
    number: string,
    agency: string
  ): Promise<string> {
    const bank = await this.getBank(number, agency);
    if (!bank) {
      throw new ApiError(bankErrorMessages.bankNotFound, 404);
    }

    const { password, id } = bank;

    const correctPassword: boolean = await compareHashed(
      passwordToCompare,
      password
    );

    if (!correctPassword) {
      throw new ApiError(genericErrorMessages.unauthorized, 401);
    }

    const tokenBank = jwt.sign({ id }, passwordBankJWT, {
      expiresIn: '1h',
    });

    return tokenBank;
  }
}
