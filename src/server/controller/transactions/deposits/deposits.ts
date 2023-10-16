import { RequestHandler } from 'express';
import { Deposit } from '../../../services/transactions/deposits/deposit.services';

export const deposit: RequestHandler = async (req, res) => {
  const { value } = req.body;
  const { userID } = req.headers;

  const user = await Deposit(Number(userID), value);

  res.status(200).json(user);
};
