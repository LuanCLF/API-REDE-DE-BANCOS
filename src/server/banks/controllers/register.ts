import { Request, Response } from 'express';

import { CreateBankDto } from '../dtos/banks.dtos';
import { validation } from '../../conttrollers/shared/middlewares/validation';

import * as yup from 'yup';

import { Register } from '../services/register.services';

export const registerValidation = validation((getSchema) => ({
  body: getSchema<CreateBankDto>(
    yup.object().shape({
      name: yup
        .string()
        .required()
        .min(5)
        .max(20)
        .matches(/^[a-zA-Z]+$/i),
      number: yup
        .string()
        .required()
        .min(4)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .required()
        .min(4)
        .matches(/^[0-9]+$/),
      password: yup.string().required().min(5),
      zipcode: yup
        .string()
        .required()
        .min(8)
        .max(8)
        .matches(/^[0-9]+$/),
    })
  ),
}));

export const registerBank = async (
  req: Request<{}, {}, CreateBankDto>,
  res: Response
) => {
  const createBankDto: CreateBankDto = {
    ...req.body,
  };
  await Register(createBankDto);

  return res.status(201).json();
};
