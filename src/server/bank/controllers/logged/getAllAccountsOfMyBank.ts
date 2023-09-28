import { Request, Response } from 'express';
import { genericErrorMessages } from '../../../messages/messages';
import { bankLogged } from '../../services/service.bank.logged';

export const getAllAccountsOfMyBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const logged = new bankLogged(Number(bankID));

    const bank = await logged.getMyBank();
    const accounts = await logged.getAllAccounts();

    const { number, agency, name, zipcode } = bank;
    const bankAccounts = {
      number,
      agency,
      name,
      zipcode,
      accounts,
    };

    return res.status(200).json(bankAccounts);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
