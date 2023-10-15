import { RequestHandler } from 'express';
import { ListWithdrawals } from '../service/listWithdrawals.services';

export const listWithdrawals: RequestHandler = async (req, res) => {
  const { userID } = req.headers;
  const page = Number(req.query.page) || 0;

  const withdrawals = await ListWithdrawals(Number(userID), page);
  res.status(200).json(withdrawals);
};
