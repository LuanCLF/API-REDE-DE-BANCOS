import { Request, Response } from 'express';
import { dateFormat } from '../../../shared/others/code/dateFormat';
import { GetAllAccounts } from '../../services/logged/getAccounts.services';

export const getAccounts = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const bank = await GetAllAccounts(Number(bankID));

  if (bank.accounts.length > 0) {
    bank.accounts.map((object) => {
      const { updated_at, number, created_at, ...rest } = object;

      return { ...rest, created_at: dateFormat(created_at) };
    });
  }
  return res.status(200).json(bank);
};
