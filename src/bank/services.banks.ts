import {
  getAccounstsWithBankID,
  getBank,
  getBankWithID,
  getPasswordFrom,
} from '../utils/getFromDB';
import { passwordBankJWT, pool } from '../connection/conectDb';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { compareHashed, hasher } from '../utils/hasher';
import { dateFormat } from '../utils/dateFormat';
import { LoginBankDto, RegisterBankDto } from '../dtos/bank/banks.dtos';
import { IBank, IBankValidate } from '../entitys/bank/bank.entity';
import { IAccount } from '../entitys/user/user.entity';

const registerBankService = async (req: Request<{}, {}, RegisterBankDto>) => {
  try {
    const { number, agency, password, name, zipcode } = req.body;

    const bank: IBankValidate | undefined = await getBank(number, agency);

    if (bank !== undefined) {
      return 400;
    }
    const passwordHashed = await hasher(password);
    const queryRegister =
      'insert into banks (number,agency, password, name, created_at, updated_at, zipcode) values ($1,$2,$3,$4, now(), now(), $5)';
    await pool.query(queryRegister, [
      number,
      agency,
      passwordHashed,
      name,
      zipcode,
    ]);

    return 200;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

const loginBankService = async (req: Request<{}, {}, LoginBankDto>) => {
  try {
    const { number, agency, password } = req.body;
    const bank: IBankValidate | undefined = await getBank(number, agency);

    if (bank === undefined) {
      return 404;
    }
    const correctPassword: boolean = await compareHashed(
      password,
      bank.password
    );
    if (!correctPassword) {
      return 401;
    }

    const tokenBank = jwt.sign({ id: bank.id }, passwordBankJWT, {
      expiresIn: '1h',
    });

    return tokenBank;
  } catch (error) {
    throw new Error();
  }
};

const searchBankService = async (req: Request) => {
  try {
    const { bankID } = req.headers;
    const bank: IBank = await getBankWithID(Number(bankID));

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
    const bank: IBank = await getBankWithID(Number(bankID));
    let accounts: Array<IAccount> = await getAccounstsWithBankID(
      Number(bankID)
    );
    if (accounts.length > 0) {
      accounts.map((object) => {
        object.created_at = dateFormat(object.created_at);
        object.updated_at = dateFormat(object.updated_at);
      });
    }
    const { number, agency, name, zipcode } = bank;
    const bankAccounts = {
      number,
      agency,
      name,
      zipcode,
      accounts,
    };

    return bankAccounts;
  } catch (error) {
    throw new Error();
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
    throw new Error();
  }
};

const deleteBankService = async (req: Request) => {
  const { bankID } = req.headers;
  const { password } = req.body;
  try {
    const accounts: Array<IAccount> = await getAccounstsWithBankID(
      Number(bankID)
    );
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
    throw new Error();
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
