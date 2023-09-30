import { pool } from '../../enviroment/env';
import { genericErrorMessages } from '../../messages/messages';
import { dateFormat } from '../../utils/dateFormat';
import { compareHashed } from '../../utils/hasher';
import { IAccounts, IBank } from '../entitys/bank.entity';
import { ApiError } from '../middlewares/error';

export class bankLogged {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  private async getMyPassword(): Promise<string> {
    const { rows: bank } = await pool.query(
      'select password from banks where id = $1',
      [this.id]
    );

    return bank[0].password;
  }

  public async getAllAccounts(): Promise<Array<Partial<IAccounts>>> {
    const query =
      'select number, user_id, created_at, updated_at from accounts where bank_id = $1';
    const { rows: accounts } = await pool.query(query, [this.id]);

    if (accounts.length > 0) {
      accounts.map((object) => {
        object.created_at = dateFormat(object.created_at);
        object.updated_at = dateFormat(object.updated_at);
      });
    }

    return accounts;
  }

  public async getMyBank(): Promise<IBank> {
    const { rows } = await pool.query('select * from banks where id = $1', [
      this.id,
    ]);

    const { password, ...bank } = rows[0];

    bank.created_at = dateFormat(bank.created_at);
    bank.updated_at = dateFormat(bank.updated_at);

    return bank;
  }

  public async update(values: Array<Array<string>>): Promise<void> {
    let nameInsert = '';
    let fields = '';

    const insert: Array<string> = values.map((item, index) => {
      nameInsert = item[0];

      index > 0 ? (fields += ', ') : '';
      fields += `${nameInsert} = $${(index += 1)}`;

      const value = item[1];
      return value;
    });

    const query = `update banks set ${fields}, updated_at = now() where id = ${this.id}`;

    await pool.query(query, insert);
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

    const accounts = await this.getAllAccounts();
    if (accounts.length > 0) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }

    const query = 'delete from banks where id = $1';
    await pool.query(query, [this.id]);
  }
}
