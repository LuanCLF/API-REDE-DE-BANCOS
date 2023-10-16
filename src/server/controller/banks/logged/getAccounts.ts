import { Request, Response } from 'express';

import { GetAllAccounts } from '../../../services/banks/logged/getAccounts.services';

export const getAccounts = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const bank = await GetAllAccounts(Number(bankID));

  return res.status(200).json(bank);
};
