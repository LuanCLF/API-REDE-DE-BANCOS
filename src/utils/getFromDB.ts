import { IBank, IBankValidate } from '../entitys/bank/bank.entity';
import { pool } from '../connection/conectDb';
import { IAccount } from '../entitys/user/user.entity';

export const getBank = async (
  number: string,
  agency: string
): Promise<IBankValidate | undefined> => {
  const query =
    'select id, password from banks where number = $1 and agency = $2';
  const { rows, rowCount } = await pool.query(query, [number, agency]);
  if (rowCount < 1) {
    return undefined;
  }
  return rows[0];
};

export const getBankWithID = async (id: number): Promise<IBank | undefined> => {
  const { rows, rowCount } = await pool.query(
    'select * from banks where id = $1',
    [id]
  );
  if (rowCount < 1) return undefined;
  return rows[0];
};

export const getAccounstsWithBankID = async (
  id: number
): Promise<Array<IAccount>> => {
  const query =
    'select number, user_id, created_at, updated_at from accounts where bank_id = $1';
  const { rows } = await pool.query(query, [id]);

  return rows;
};

export const getPasswordFrom = async (column: string, id: number) => {
  const query = `select password from ${column} where id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows;
};
