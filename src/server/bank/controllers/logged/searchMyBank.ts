import { pool } from '../../../enviroment/env';
import { IBank } from '../../../entitys/bank/bank.entity';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../messages/messages';
import { BankService } from '../../services/services.banks';
import { Request, Response } from 'express';

export const searchMyBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const bankService = new BankService(pool);
    const bank: IBank | undefined = await bankService.searchMyBank(
      Number(bankID)
    );

    if (!bank) {
      return res
        .status(404)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }
    const { password, ...restBank } = bank;

    return res.status(200).json(restBank);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
