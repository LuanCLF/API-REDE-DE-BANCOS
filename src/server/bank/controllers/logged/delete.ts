import { pool } from '../../../enviroment/env';
import { Request, Response } from 'express';
import { BankService } from '../../services/services.banks';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../../messages/messages';
import { validation } from '../../middlewares/middlewares.banks';
import * as yup from 'yup';
import { DeleteBankDto } from '../../../dtos/bank/banks.dtos';

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
    if (!password) throw 'falta senha';

    const bankService = new BankService(pool);
    await bankService.delete(Number(bankID), password);

    return res.status(204).json();
  } catch (error) {
    switch (error) {
      case 404:
        return res
          .status(404)
          .json({ message: bankErrorMessages.bankNotFound });

      case 409:
        return res
          .status(error)
          .json({ message: genericErrorMessages.unauthorized });

      case 401:
        return res
          .status(error)
          .json({ message: genericErrorMessages.unauthorized });

      default:
        return res.status(500).json({ message: genericErrorMessages.intern });
    }
  }
};

export { deleteBank };
