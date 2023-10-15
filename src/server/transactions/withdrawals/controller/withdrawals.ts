import { RequestHandler } from 'express';
import { Withdrawal } from '../service/withdrawal.services';

export const withdrawal: RequestHandler = async (req, res) => {
  const { userID } = req.headers;
  const { value } = req.body;

  const user = await Withdrawal(Number(userID), value);

  res.status(200).json(user);
};
