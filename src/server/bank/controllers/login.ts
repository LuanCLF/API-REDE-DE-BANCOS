import { Request, Response } from 'express';
import { LoginBankDto } from '../../dtos/bank/banks.dtos';
import { IBankValidate } from '../../entitys/bank/bank.entity';
import { getBank } from '../../utils/getFromDB';
import {
  bankErrorMessages,
  bankSucessMessage,
  genericErrorMessages,
} from '../../messages/messages';
import { BankService } from '../services/services.banks';
import { pool } from '../../enviroment/env';
import { validation } from '../middlewares/middlewares.banks';

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

    const bank: IBankValidate | undefined = await getBank(number, agency);

    if (!bank) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }

    const bankService = new BankService(pool);
    const tokenBank = await bankService.login(password, bank);

    if (!tokenBank) {
      return res
        .status(401)
        .json({ message: genericErrorMessages.unauthorized });
    }

    return res
      .status(200)
      .json({ message: `${bankSucessMessage.logged}, Token: ${tokenBank}` });
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
