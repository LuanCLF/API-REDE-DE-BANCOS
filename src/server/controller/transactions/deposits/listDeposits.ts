import { RequestHandler } from 'express';

import { ListDeposits } from '../../../services/transactions/deposits/listDeposits.services';

export const listDeposits: RequestHandler = async (req, res) => {
  const { userID } = req.headers;
  const page = Number(req.query.page) || 0;

  const deposits = await ListDeposits(Number(userID), page);
  res.status(200).json(deposits);
};
