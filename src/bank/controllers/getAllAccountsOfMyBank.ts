import { Request, Response } from 'express';
import { BankService } from '../services/services.banks';
import { pool } from '../../enviroment/env';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { IBank } from '../../entitys/bank/bank.entity';

export const getAllAccountsOfMyBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const bankService = new BankService(pool);

    const bank: IBank | undefined = await bankService.searchMyBank(
      Number(bankID)
    );
    if (!bank) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }

    const accounts = await bankService.getAllAccounts(Number(bankID));

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
