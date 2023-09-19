import { pool } from '../../connection/conectDb';

export const getBank = async (number: string, agency: string) => {
  const query = 'select * from banks where number = $1 and agency = $2';
  const { rows } = await pool.query(query, [number, agency]);

  return rows;
};

export const getAccounstsWithBankID = async (id: number) => {
  const query = 'select * from accounts where bank_id = $1';
  const { rows } = await pool.query(query, [id]);

  return rows;
};
