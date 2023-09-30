import { RequestHandler } from 'express';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { passwordBankJWT, pool } from '../../enviroment/env';
import jwt from 'jsonwebtoken';
import { ApiError } from './error';

const midBankLogin: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const token = authorization.split(' ')[1];
  const auth = jwt.verify(token, passwordBankJWT);

  const bank = JSON.parse(JSON.stringify(auth));

  const { rowCount } = await pool.query('select id from bank where id = $1', [
    bank.id,
  ]);
  if (rowCount < 1) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  req.headers = {
    bankID: bank.id,
  };

  next();
};

export { midBankLogin };
