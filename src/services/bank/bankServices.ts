import {
  getAccounstsWithBankID,
  getBank,
  getBankWithID,
  getPasswordFrom,
} from '../../utils/getDB';
import { passwordBankJWT, pool } from '../../connection/conectDb';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { compareHashed, hasher } from '../../utils/hasher';
import { dateFormat } from '../../utils/dateFormat';

const registerBankService = async (req: Request) => {
  try {
    const { number, agency, password, name } = req.body;

    const rows: Array<object> = await getBank(String(number), String(agency));
    if (rows.length > 0) {
      return 400;
    }

    const passwordHashed = await hasher(password);
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
    const bank = await getBank(number, agency);

    if (bank.length < 1) {
      return 404;
    }

    const correctPassword: boolean = await compareHashed(
      password,
      bank[0].password
    );
    if (!correctPassword) {
      return 401;
    }

    const tokenBank = jwt.sign({ id: bank[0].id }, passwordBankJWT, {
      expiresIn: '1h',
    });

    return tokenBank;
  } catch (error) {
    return 500;
  }
};

const searchBankService = async (req: Request) => {
  try {
    const { bankID } = req.headers;
    const bank = await getBankWithID(Number(bankID));

    bank.created_at = dateFormat(bank.created_at);
    bank.updated_at = dateFormat(bank.updated_at);

    return bank;
  } catch (error) {
    throw new Error();
  }
};

const getAllAccountsService = async (req: Request) => {
  try {
    const { bankID } = req.headers;
    const bank = await getBankWithID(Number(bankID));
    const accounts = await getAccounstsWithBankID(Number(bankID));

    if (accounts.length > 0) {
      accounts.map((object) => {
        object.created_at = dateFormat(object.created_at);
        object.updated_at = dateFormat(object.updated_at);
      });
    }

    const bankAccounts = {
      id: bankID,
      number: bank.number,
      agency: bank.agency,
      accounts,
    };

    return bankAccounts;
  } catch (error) {
    return 500;
  }
};

const updateDataBankService = async (req: Request) => {
  try {
    const { bankID } = req.headers;
    const values = req.body;

    const insert = [];
    let nameInsert = '';
    let paramsCount = 0;
    let fields = '';

    if (values[0].name) {
      nameInsert = Object.keys(values[0])[0];
      fields += `${nameInsert} = $${(paramsCount += 1)}`;

      insert.push(values[0].name);
    }
    if (values[1].password) {
      nameInsert = Object.keys(values[1])[0];
      paramsCount > 0 ? (fields += ', ') : '';
      fields += `${nameInsert} = $${(paramsCount += 1)}`;

      const passwordHashed = await hasher(values[1].password);
      insert.push(passwordHashed);
    }

    insert.push(bankID);
    const query = `update banks set ${fields}, updated_at = now() where id = $${(paramsCount += 1)} `;

    await pool.query(query, insert);

    return 204;
  } catch (error) {
    return 500;
  }
};

const deleteBankService = async (req: Request) => {
  const { bankID } = req.headers;
  const { password } = req.body;
  try {
    const accounts = await getAccounstsWithBankID(Number(bankID));
    if (accounts.length > 0) {
      return 409;
    }
    const passwordHashed = await getPasswordFrom('banks', Number(bankID));

    const correctPassword = compareHashed(password, passwordHashed[0].password);
    if (!correctPassword) {
      return 401;
    }

    const query = 'delete from banks where id = $1';
    await pool.query(query, [bankID]);

    return 204;
  } catch (error) {
    return 500;
  }
};

export {
  registerBankService,
  searchBankService,
  getAllAccountsService,
  updateDataBankService,
  loginBankService,
  deleteBankService,
};
