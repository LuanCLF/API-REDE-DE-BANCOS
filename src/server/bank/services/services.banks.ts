import { passwordBankJWT } from '../../enviroment/env';
import { CreateBankDto, UpdateBankDto } from '../../dtos/bank/banks.dtos';
import { IBank, IBankValidate } from '../../entitys/bank/bank.entity';
import { getBankWithID } from '../../utils/getFromDB';
import { compareHashed, hasher } from '../../utils/hasher';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { dateFormat } from '../../utils/dateFormat';

export class BankService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async create(createBankDto: CreateBankDto): Promise<void> {
    try {
      const { number, agency, password, name, zipcode } = createBankDto;
      const passwordHashed = await hasher(password);
      const queryRegister =
        'INSERT INTO banks (number, agency, password, name, created_at, updated_at, zipcode) VALUES ($1, $2, $3, $4, NOW(), NOW(), $5)';

      await this.pool.query(queryRegister, [
        number,
        agency,
        passwordHashed,
        name,
        zipcode,
      ]);
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }
  public async login(
    password: string,
    bank: IBankValidate
  ): Promise<string | undefined> {
    try {
      const correctPassword: boolean = await compareHashed(
        password,
        bank.password
      );

      if (!correctPassword) {
        return undefined;
      }
      const tokenBank = jwt.sign({ id: bank.id }, passwordBankJWT, {
        expiresIn: '1h',
      });

      return tokenBank;
    } catch (error) {
      throw new Error();
    }
  }

  public async searchMyBank(id: number): Promise<IBank | undefined> {
    try {
      const bank: IBank | undefined = await getBankWithID(id);
      if (!bank) return undefined;
      bank.created_at = dateFormat(bank.created_at);
      bank.updated_at = dateFormat(bank.updated_at);

      return bank;
    } catch (error) {
      throw new Error();
    }
  }

  public async getAllAccounts(id: number) {
    try {
      const query =
        'select number, user_id, created_at, updated_at from accounts where bank_id = $1';
      const { rows: accounts } = await this.pool.query(query, [id]);

      if (accounts.length > 0) {
        accounts.map((object) => {
          object.created_at = dateFormat(object.created_at);
          object.updated_at = dateFormat(object.updated_at);
        });
      }

      return accounts;
    } catch (error) {
      throw new Error();
    }
  }

  public async update(id: number, values: Array<UpdateBankDto>): Promise<void> {
    try {
      const insert = [];

      let nameInsert = '';
      let paramsCount = 0;
      let fields = '';

      values.filter((item, index) => {
        const value = Object.values(item)[0];
        if (value) {
          nameInsert = Object.keys(values[index])[0];
          paramsCount > 0 ? (fields += ', ') : '';
          fields += `${nameInsert} = $${(paramsCount += 1)}`;

          return insert.push(value);
        }
      });

      insert.push(id);
      paramsCount += 1;
      const query = `update banks set ${fields}, updated_at = now() where id = $${paramsCount} `;

      await this.pool.query(query, insert);
    } catch (error) {
      throw new Error();
    }
  }

  public async delete(id: number, password: string) {
    try {
      const bank = await this.searchMyBank(id);
      if (!bank) return 404;

      const accounts = await this.getAllAccounts(id);
      if (accounts.length > 0) {
        return 409;
      }

      const correctPassword = compareHashed(password, bank.password);
      if (!correctPassword) {
        return 401;
      }

      const query = 'delete from banks where id = $1';
      await this.pool.query(query, [id]);

      return 204;
    } catch (error) {
      throw new Error();
    }
  }
}
