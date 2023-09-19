import { compare, hash } from 'bcrypt';
import { getAccounstsWithBankID, getBank } from '../utils/getBank';
import { passwordBankJWT, pool } from '../../connection/conectDb';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

const registerBankService = async (req: Request) => {
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

const loginBankService = async (req: Request) => {
  try {
    const { number, agency, password } = req.body;
    const query = 'select * from banks where number = $1 and agency = $2';
    const { rows: bank, rowCount } = await pool.query(query, [number, agency]);
    if (rowCount < 1) {
      return 404;
    }

    const correctPassword = await compare(password, bank[0].password);
    if (!correctPassword) {
      return 401;
    }

    const tokenBank = jwt.sign(
      { id: bank[0].id, number, agency },
      passwordBankJWT,
      {
        expiresIn: '1h',
      }
    );

    return tokenBank;
  } catch (error) {
    console.log(error);
    return 500;
  }
};

const getAllAccountsService = async (req: Request) => {
  try {
    const { bankID, number, agency } = req.body;

    const accounts = await getAccounstsWithBankID(bankID);

    const bankAccounts = {
      id: bankID,
      number,
      agency,
      accounts,
    };

    return bankAccounts;
  } catch (error) {
    return 500;
  }
};

// const updateDataBankService = async (req: Request) => {
//   try {
//     const { number, agency, password, name } = req.body;
//     const bank = await getBank(number, agency);
//     if (bank.length < 1) {
//       return 404;
//     }

//     return 'ds';
//   } catch (error) {
//     return 500;
//   }
// };

export {
  registerBankService,
  getAllAccountsService,
  // updateDataBankService,
  loginBankService,
};
