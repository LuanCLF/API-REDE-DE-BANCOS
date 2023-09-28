import { passwordBankJWT, pool } from '../../enviroment/env';
import { CreateBankDto } from '../../dtos/bank/banks.dtos';
import { compareHashed, hasher } from '../../utils/hasher';
import jwt from 'jsonwebtoken';
import { dateFormat } from '../../utils/dateFormat';

export class BankService {
  private async searchBank(number: string, agency: string) {
    try {
      const { rows: bank, rowCount } = await pool.query(
        'select id, password from banks where number = $1 and agency = $2',
        [number, agency]
      );
      if (rowCount < 1) return undefined;

      return bank[0];
    } catch (error) {
      throw new Error();
    }
  }

  public async getBanks() {
    try {
      const { rows: banks } = await pool.query(
        'select name, number, agency, zipcode, created_at from banks'
      );
      banks.map((bank) => {
        bank.created_at = dateFormat(bank.created_at);
      });
    } catch (error) {
      throw new Error();
    }
  }

  public async create(createBankDto: CreateBankDto): Promise<void> {
    try {
      const { number, agency, password, name, zipcode } = createBankDto;

      const exist = await this.searchBank(number, agency);
      if (exist) throw 409;

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
    } catch (error) {
      throw error;
    }
  }

  public async login(
    passwordToCompare: string,
    number: string,
    agency: string
  ): Promise<string> {
    try {
      const bank = await this.searchBank(number, agency);
      if (!bank) throw 404;

      const { password, id } = bank;

      const correctPassword: boolean = await compareHashed(
        passwordToCompare,
        password
      );

      if (!correctPassword) throw 401;

      const tokenBank = jwt.sign({ id }, passwordBankJWT, {
        expiresIn: '1h',
      });

      return tokenBank;
    } catch (error) {
      throw error;
    }
  }
}
