import { compare, hash } from 'bcrypt';
import { pool } from '../../conection/conectDb';
import { Request, Response } from 'express';
import { message } from '../../messages/messagerError';
import { getBank } from '../utils/getBank';

const registerBank = async (req: Request, res: Response) => {
  try {
    const { number, agency, password, name } = req.body;

    const rows = await getBank(number, agency);
    if (rows.length > 0) {
      return res.status(404).json({
        mensagem: 'Já existe um banco com esse mesmo número e agência',
      });
    }

    const passwordHashed = await hash(password, 10);
    const queryRegister =
      'insert into banks (number,agency, password, name) values ($1,$2,$3,$4) returning id, number, agency, name';
    const { rows: bank } = await pool.query(queryRegister, [
      number,
      agency,
      passwordHashed,
      name,
    ]);

    res.status(200).json(bank[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json(message);
  }
};

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const { number, agency, password } = req.body;

    const bank = await getBank(String(number), String(agency));
    if (bank.length < 1) {
      return res.status(404).json({ mensagem: 'Banco não encontrado' });
    }
    const comparePassword = await compare(`${password}`, bank[0].password);
    if (!comparePassword) {
      return res.status(401).json({ mensagem: 'Sem autorização' });
    }

    const queryAccounts =
      'select * from accounts a join banks as b on a.bank_id = b.id where id = $1';
    const { rows: accounts } = await pool.query(queryAccounts, [bank[0].id]);

    const accountsBank = {
      id: bank[0].id,
      numero: bank[0].number,
      agency: bank[0].agency,
      accounts: [...accounts],
    };
    res.status(200).json(accountsBank);
  } catch (error) {
    console.log(error);
    res.status(500).json(message);
  }
};

export { registerBank, getAllAccounts };
