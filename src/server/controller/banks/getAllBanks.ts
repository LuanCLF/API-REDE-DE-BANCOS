import { RequestHandler } from 'express';

import { GetBanks } from '../../services/banks/getBanks.services';

export const getAllBanks: RequestHandler = async (req, res) => {
  const page = Number(req.query.page) || 0;

  const banks = await GetBanks(page);

  return res.status(200).json(banks);
};
