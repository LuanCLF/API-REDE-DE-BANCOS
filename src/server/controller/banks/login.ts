import { Request, Response } from 'express';
import { LoginBankDto } from '../../dtos/banks/banks.dtos';
import { validation } from '../../shared/middlewares/validation';

import * as yup from 'yup';
import { login } from '../../services/banks/login.services';

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

  const token = await login(password, number, agency);

  return res.status(200).json({ token });
};
