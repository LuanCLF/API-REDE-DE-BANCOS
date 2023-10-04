import { Request, Response } from 'express';
import { LoginBankDto } from '../dtos/banks.dtos';
import { BankService } from '../services/services.banks';
import { validation } from '../middlewares/validation';

import * as yup from 'yup';

export const loginValidation = validation((getSchema) => ({
  body: getSchema<LoginBankDto>(
    yup.object().shape({
      number: yup.string().required(),
      agency: yup.string().required(),
      password: yup.string().required(),
    })
  ),
}));

export const loginBank = async (
  req: Request<{}, {}, LoginBankDto>,
  res: Response
) => {
  const { number, agency, password } = req.body;

  const bankService = new BankService();
  const tokenBank = await bankService.login(password, number, agency);

  return res.status(200).json({ message: tokenBank });
};
