import { pool } from '../../conection/conectDb';

export const getBank = async (number: string, agency: string) => {
  const query = 'select * from banks where number = $1 and agency = $2';
  const { rows } = await pool.query(query, [number, agency]);

  return rows;
};
