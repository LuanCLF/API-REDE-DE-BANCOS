import { RequestHandler } from 'express';

import { GetBanks } from '../../services/banks/getBanks.services';

export const getAllBanks: RequestHandler = async (req, res) => {
  console.log(process.env.DATABASE_URL, '   ', process.env.luan);
  const page = Number(req.query.page) || 0;

  const banks = await GetBanks(page);

  return res.status(200).json(banks);
};
