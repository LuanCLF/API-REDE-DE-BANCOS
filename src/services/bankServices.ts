import { compare, hash } from 'bcrypt';
import { getBank } from './utils/getBank';
import { pool } from '../conection/conectDb';
import { Request } from 'express';

export const registerBankService = async (req: Request) => {
  try {
    const { number, agency, password, name } = req.headers;

    const rows: Array<object> = await getBank(String(number), String(agency));
    if (rows.length > 0) {
      return 400;
    }

    const passwordHashed = await hash(String(password), 10);
    const queryRegister =
      'insert into banks (number,agency, password, name) values ($1,$2,$3,$4)';
    await pool.query(queryRegister, [number, agency, passwordHashed, name]);

    return 200;
  } catch (error) {
    return 500;
  }
};

export const getAllAccountsService = async (req: Request) => {
  try {
    const { number, agency, password } = req.body;

    const bank = await getBank(String(number), String(agency));
    if (bank.length < 1) {
      return 404;
    }

    const comparePassword = await compare(`${password}`, bank[0].password);
    if (!comparePassword) {
      return 401;
    }

    const queryAccounts =
      'select * from accounts a join banks as b on a.bank_id = b.id where id = $1';
    const { rows: accounts } = await pool.query(queryAccounts, [bank[0].id]);

    const bankAccounts = {
      id: bank[0].id,
      numero: bank[0].number,
      agency: bank[0].agency,
      accounts: [...accounts],
    };

    return bankAccounts;
  } catch (error) {
    return 500;
  }
};
