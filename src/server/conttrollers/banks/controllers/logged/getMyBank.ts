import { Request, Response } from 'express';
import { bankLogged } from '../../services/banks.services.logged';
import { dateFormat } from '../../../shared/others/code/dateFormat';

export const getMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const logged = new bankLogged(Number(bankID));

  const bank = await logged.getMyBank();

  const { created_at: date, ...rest } = bank;
  const bankFormat = { ...rest, created_at: dateFormat(date) };

  return res.status(200).json(bankFormat);
};
