import { Request, Response } from 'express';
import { message } from '../../messages/messagerError';
import { hash } from 'bcrypt';
import { pool } from '../../conection/conectDb';
import { getBank } from '../utils/getBank';

const createAccount = async (req: Request, res: Response) => {
  try {
    const { number, agency, ...resto } = req.headers;

    const bank = await getBank(String(number), String(agency));
    if (bank.length < 1) {
      return res.status(404).json({ mensagem: 'Informações de banco erradas' });
    }

    const { rowCount: user } = await pool.query(
      'select * from users where CPF = $1 or email = $2',
      [req.headers.CPF, req.headers.email]
    );

    if (user > 0) {
      return res
        .status(404)
        .json({ mensagem: 'Já existe um cadastro com esses dados' });
    }

    const { password } = req.headers;
    const passwordHashed = await hash(String(password), 10);
    req.headers.password = passwordHashed;

    const insert = Object.values(resto);
    const queryUser =
      'insert into users (name, CPF, dateOfBirth, phoneNumber, email, password) values ($1,$2,$3,$4,$5,$6) returning id';
    const { rows: id } = await pool.query(queryUser, insert);

    const queryAccount =
      'insert into accounts (bank_id, balance, user_id) values ($1, 0, $2) returning *';

    const { rows: account } = await pool.query(queryAccount, [
      bank[0].id,
      id[0].id,
    ]);

    res.status(200).json(account[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(message);
  }
};

export { createAccount };
