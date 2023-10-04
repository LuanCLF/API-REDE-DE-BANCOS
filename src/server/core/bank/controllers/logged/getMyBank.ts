import { Request, Response } from 'express';
import { bankLogged } from '../../services/service.bank.logged';
import { dateFormat } from '../../../utils/dateFormat';

export const getMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const logged = new bankLogged(Number(bankID));

  const bank = await logged.getMyBank();

  const { created_at: date, ...rest } = bank;
  const bankFormat = { ...rest, created_at: dateFormat(date) };

  return res.status(200).json(bankFormat);
};
