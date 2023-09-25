import { pool } from '../../connection/conectDb';
import { Request, Response } from 'express';
import { BankService } from '../services/services.banks';
import { genericErrorMessages } from '../../messages/messages';
import { validation } from '../middlewares/middlewares.banks';
import * as yup from 'yup';
import { DeleteBankDto } from '../../dtos/bank/banks.dtos';

export const deleteValidation = validation((getSchema) => ({
  body: getSchema<DeleteBankDto>(
    yup.object().shape({
      password: yup.string().required().min(5),
    })
  ),
}));

const deleteBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;
  const { password } = req.body;
  try {
    const bankService = new BankService(pool);
    await bankService.delete(Number(bankID), password);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

export { deleteBank };
