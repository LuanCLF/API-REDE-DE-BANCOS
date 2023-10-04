import { prisma } from '../../../../database/prismaClient';
import { CreateBankDto } from '../dtos/banks.dtos';
import { IBank } from '../entities/bank.entities';
import { ApiError } from '../../shared/middlewares/error';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../shared/others/messages/messages';
import { compareHashed } from '../../shared/others/code/hasher';

export class bankLogged {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  private async getMyPassword(): Promise<string> {
    const bank = await prisma.bank.findUnique({
      where: {
        id: this.id,
      },
      select: {
        password: true,
      },
    });
    if (!bank) {
      throw new ApiError(bankErrorMessages.bankNotFound, 404);
    }

    return bank.password;
  }

  public async getAllAccounts() {
    const bank = await prisma.bank.findUnique({
      where: { id: this.id },
      select: {
        name: true,
        number: true,
        agency: true,
        created_at: true,
        accounts: true,
      },
    });
    if (!bank) {
      throw new ApiError(bankErrorMessages.bankNotFound, 404);
    }

    return bank;
  }

  public async getMyBank(): Promise<IBank> {
    const bank = await prisma.bank.findUnique({
      where: { id: this.id },
      select: {
        name: true,
        number: true,
        agency: true,
        zipcode: true,
        created_at: true,
      },
    });
    if (!bank) {
      throw new ApiError(bankErrorMessages.bankNotFound, 404);
    }

    return bank;
  }

  public async update(values: CreateBankDto): Promise<void> {
    console.log(values.zipcode);
    await prisma.bank.update({
      where: {
        id: this.id,
      },
      data: {
        ...values,
        updated_at: new Date(),
      },
    });
  }

  public async delete(passwordToCompare: string): Promise<void> {
    const bankPassword = await this.getMyPassword();

    const correctPassword = await compareHashed(
      passwordToCompare,
      bankPassword
    );
    if (!correctPassword) {
      throw new ApiError(genericErrorMessages.unauthorized, 401);
    }

    const bank = await this.getAllAccounts();
    if (bank.accounts.length > 0) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }

    await prisma.bank.delete({
      where: {
        id: this.id,
      },
    });
  }
}
