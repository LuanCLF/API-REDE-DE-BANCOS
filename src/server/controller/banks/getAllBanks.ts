import { RequestHandler } from 'express';

import { GetBanks } from '../../services/banks/getBanks.services';

export const getAllBanks: RequestHandler = async (req, res) => {
  const banks = await GetBanks();

  return res.status(200).json(banks);
};
