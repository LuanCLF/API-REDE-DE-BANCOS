import { Request, Response } from 'express';

import { GetMyBank } from '../../../services/banks/logged/getMyBank.services';

export const getMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const bank = await GetMyBank(Number(bankID));

  return res.status(200).json(bank);
};
