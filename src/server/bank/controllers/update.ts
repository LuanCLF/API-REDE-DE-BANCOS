import { RequestHandler } from 'express';
import { BankService } from '../services/services.banks';
import { pool } from '../../enviroment/env';
import { genericErrorMessages } from '../../messages/messages';
import * as yup from 'yup';
import { validation } from '../middlewares/middlewares.banks';
import { UpdateBankDto } from '../../dtos/bank/banks.dtos';

export const updateValidation = validation((getSchema) => ({
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup.string().optional().min(3).max(20),
      password: yup.string().optional().min(5),
      zipcode: yup
        .string()
        .optional()
        .min(8)
        .max(8)
        .matches(/^[0-9]+$/),
    })
  ),
}));

export const update: RequestHandler = async (req, res) => {
  try {
    const { bankID } = req.headers;
    const values = req.body;
    const bankService = new BankService(pool);
    await bankService.update(Number(bankID), values);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
