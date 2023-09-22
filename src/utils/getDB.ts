import { pool } from '../connection/conectDb';

export const getBank = async (number: string, agency: string) => {
  const query = 'select * from banks where number = $1 and agency = $2';
  const { rows } = await pool.query(query, [number, agency]);

  return rows;
};
export const getBankWithID = async (id: number) => {
  const { rows } = await pool.query(
    'select number, agency, name, created_at, updated_at from banks where id = $1',
    [id]
  );
  return rows[0];
};

export const getAccounstsWithBankID = async (id: number) => {
  const query =
    'select number, bank_id, user_id, created_at, updated_at from accounts where bank_id = $1';
  const { rows } = await pool.query(query, [id]);

  return rows;
};

export const getPasswordFrom = async (column: string, id: number) => {
  const query = `select password from ${column} where id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows;
};
