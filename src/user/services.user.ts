import { Request } from 'express';

import { passwordUserJWT, pool } from '../connection/conectDb';
import { getBank } from '../utils/getFromDB';

import jwt from 'jsonwebtoken';
import { compareHashed, hasher } from '../utils/hasher';
import { IBankValidate } from '../entitys/bank/bank.entity';

const createAccountUserService = async (req: Request) => {
  try {
    const { number, agency, ...rest } = req.body;

    const bank: IBankValidate | undefined = await getBank(number, agency);
    if (bank === undefined) {
      return 404;
    }
    const { rows: bank_ids, rowCount } = await pool.query(
      'select bank_id from accounts as a join users as u on a.user_id = u.id where u.CPF = $1 or u.email = $2',
      [rest.CPF, rest.email]
    );

    if (rowCount > 0) {
      const exist = bank_ids.some((element) => {
        return element.bank_id === bank.id;
      });
      if (exist) {
        return 409;
      }
    }

    const { password } = rest;
    const passwordHashed = await hasher(password);
    rest.password = passwordHashed;

    const insert = Object.values(rest);

    const queryUser =
      'insert into users (name, CPF, dateOfBirth, phoneNumber, email, password) values ($1,$2,$3,$4,$5,$6) returning id';
    const queryAccount =
      'insert into accounts (bank_id, balance, user_id) values ($1, 0, $2) returning *';

    const { rows: id } = await pool.query(queryUser, insert);

    const { rows: account } = await pool.query(queryAccount, [
      bank.id,
      id[0].id,
    ]);

    return account[0];
  } catch (error) {
    throw new Error();
  }
};

const loginUserService = async (req: Request) => {
  try {
    const { number, agency, CPF, email, password } = req.body;

    const bank: IBankValidate | undefined = await getBank(number, agency);
    if (bank === undefined) {
      return 404;
    }

    const query =
      'select u.* from users as u join accounts as a on a.user_id = u.id and bank_id = $1 where u.CPF = $2 and u.email = $3';

    const { rows: user, rowCount } = await pool.query(query, [
      bank.id,
      CPF,
      email,
    ]);

    if (rowCount < 1) {
      return 404;
    }

    const correctPassword = await compareHashed(password, user[0].password);
    if (!correctPassword) {
      return 401;
    }

    const tokenUser = jwt.sign({ id: user[0].id }, passwordUserJWT, {
      expiresIn: '1h',
    });

    return tokenUser;
  } catch (error) {
    throw new Error();
  }
};

export { createAccountUserService, loginUserService };
