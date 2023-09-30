import { Request, Response } from 'express';
import { LoginBankDto } from '../../dtos/bank/banks.dtos';
import {
  bankErrorMessages,
  bankSucessMessage,
  genericErrorMessages,
} from '../../messages/messages';
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
  try {
    const { number, agency, password } = req.body;

    const bankService = new BankService();
    const tokenBank = await bankService.login(password, number, agency);

    return res
      .status(200)
      .json({ message: `${bankSucessMessage.logged}, Token: ${tokenBank}` });
  } catch (error) {
    switch (error) {
      case 404:
        return res
          .status(404)
          .json({ message: bankErrorMessages.bankAlreadyExist });
      case 401:
        return res
          .status(401)
          .json({ message: genericErrorMessages.unauthorized });
      default:
        return res.status(500).json({ message: genericErrorMessages.intern });
    }
  }
};
