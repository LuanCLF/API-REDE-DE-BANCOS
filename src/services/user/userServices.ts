import { Request } from 'express';

import { passwordUserJWT, pool } from '../../connection/conectDb';
import { getBank } from '../../utils/getDB';

import jwt from 'jsonwebtoken';
import { compareHashed, hasher } from '../../utils/hasher';

const createAccountUserService = async (req: Request) => {
  try {
    const { number, agency, ...rest } = req.body;

    const bank = await getBank(String(number), String(agency));
    if (bank.length < 1) {
      return 404;
    }

    const { rowCount: user } = await pool.query(
      'select * from users where CPF = $1 or email = $2',
      [rest.CPF, rest.email]
    );

    if (user > 0) {
      return 400;
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
      bank[0].id,
      id[0].id,
    ]);

    return account[0];
  } catch (error) {
    return 500;
  }
};

const loginUserService = async (req: Request) => {
  try {
    const { CPF, email, password } = req.body;

    const query = 'select * from users where CPF = $1 and email = $2';
    const { rows: user, rowCount } = await pool.query(query, [CPF, email]);
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
    return 500;
  }
};

export { createAccountUserService, loginUserService };
