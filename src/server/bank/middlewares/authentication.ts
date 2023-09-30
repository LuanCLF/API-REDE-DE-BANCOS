import { RequestHandler } from 'express';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { passwordBankJWT, pool } from '../../enviroment/env';
import jwt from 'jsonwebtoken';

const midBankLogin: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ message: genericErrorMessages.unauthorized });
    }

    const token = authorization.split(' ')[1];
    const auth = jwt.verify(token, passwordBankJWT);

    const bank = JSON.parse(JSON.stringify(auth));

    const { rowCount } = await pool.query('select id from bank where id = $1', [
      bank.id,
    ]);
    if (rowCount < 1) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }
    req.headers = {
      bankID: bank.id,
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.unauthorized });
  }
};

export { midBankLogin };
