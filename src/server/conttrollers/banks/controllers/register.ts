import { Request, Response } from 'express';

import { CreateBankDto } from '../dtos/banks.dtos';
import { validation } from '../../shared/middlewares/validation';

import { BankService } from '../services/banks.services';

import * as yup from 'yup';
import { validZipCode } from '../../shared/others/code/validZipCode';

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
        .min(3)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .required()
        .min(3)
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

  const zip = await validZipCode(createBankDto.zipcode);
  createBankDto.zipcode = zip;

  const service = new BankService();

  const bank = await service.create(createBankDto);

  return res.status(201).json(bank);
};
