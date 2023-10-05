import { Request, Response } from 'express';
import { bankLogged } from '../../services/banks.services.logged';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const getAllAccountsOfMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;
  const logged = new bankLogged(Number(bankID));

  const bank = await logged.getAllAccounts();

  if (bank.accounts.length > 0) {
    bank.accounts.map((object) => {
      const { updated_at, number, created_at, ...rest } = object;

      return { ...rest, created_at: dateFormat(created_at) };
    });
  }
  return res.status(200).json(bank);
};
