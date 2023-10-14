import { Request, Response } from 'express';
import { dateFormat } from '../../../shared/others/code/dateFormat';
import { GetMyBank } from '../../services/logged/getMyBank.services';

export const getMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const bank = await GetMyBank(Number(bankID));

  const { created_at: date, ...rest } = bank;
  const bankFormat = { ...rest, created_at: dateFormat(new Date(date)) };

  return res.status(200).json(bankFormat);
};
