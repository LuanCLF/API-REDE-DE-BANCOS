import { Request, Response } from 'express';
import { bankLogged } from '../../services/service.bank.logged';

export const getMyBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;

  const logged = new bankLogged(Number(bankID));

  const bank = await logged.getMyBank();

  return res.status(200).json(bank);
};
