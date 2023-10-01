import { IBank, IBankValidate } from '../entitys/bank.entity';
import { ApiError } from '../middlewares/error';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../messages/messages';
import { passwordBankJWT, pool } from '../../../enviroment/env';
import { dateFormat } from '../../utils/dateFormat';
import { CreateBankDto } from '../../../dtos/bank/banks.dtos';
import { compareHashed, hasher } from '../../utils/hasher';
import jwt from 'jsonwebtoken';

export class BankService {
  private async searchBank(
    number: string,
    agency: string
  ): Promise<IBankValidate | undefined> {
    const { rows: bank, rowCount } = await pool.query(
      'select id, password from banks where number = $1 and agency = $2',
      [number, agency]
    );
    if (rowCount < 1) return undefined;

    return bank[0];
  }

  public async getBanks(): Promise<Array<Partial<IBank>>> {
    const { rows: banks } = await pool.query(
      'select name, number, agency, zipcode, created_at from banks'
    );
    banks.map((bank) => {
      bank.created_at = dateFormat(bank.created_at);
    });

    return banks;
  }

  public async create(createBankDto: CreateBankDto): Promise<void> {
    const { number, agency, password, name, zipcode } = createBankDto;

    const exist: IBankValidate | undefined = await this.searchBank(
      number,
      agency
    );
    if (exist) throw new ApiError(genericErrorMessages.unauthorized, 409);

    const passwordHashed = await hasher(password);
    const queryRegister =
      'insert into banks (number, agency, password, name, created_at, updated_at, zipcode) VALUES ($1, $2, $3, $4, now(), now(), $5)';

    await pool.query(queryRegister, [
      number,
      agency,
      passwordHashed,
      name,
      zipcode,
    ]);
  }

  public async login(
    passwordToCompare: string,
    number: string,
    agency: string
  ): Promise<string> {
    const bank: IBankValidate | undefined = await this.searchBank(
      number,
      agency
    );
    if (!bank) {
      throw new ApiError(bankErrorMessages.bankAlreadyExist, 404);
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
