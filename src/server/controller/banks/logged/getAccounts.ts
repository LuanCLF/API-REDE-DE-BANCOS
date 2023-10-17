import { Request, Response } from 'express';

import { GetAllAccounts } from '../../../services/banks/logged/getAccounts.services';

export const getAccounts = async (req: Request, res: Response) => {
  const { bankID } = req.headers;
  const page = Number(req.query.page) || 0;

  const bank = await GetAllAccounts(Number(bankID), page);

  return res.status(200).json(bank);
};
