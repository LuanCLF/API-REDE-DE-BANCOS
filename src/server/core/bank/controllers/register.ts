import { Request, Response } from 'express';

import { CreateBankDto } from '../../../dtos/bank/banks.dtos';
import { validation } from '../middlewares/validation';

import { BankService } from '../services/services.banks';

import * as yup from 'yup';
import { getZipCode } from '../../utils/getZipCode';

export const registerValidation = validation((getSchema) => ({
  body: getSchema<CreateBankDto>(
    yup.object().shape({
      name: yup.string().required().min(3),
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
  const bankService = new BankService();

  const zipCodeValidation: string = await getZipCode(req.body.zipcode);
  createBankDto.zipcode = zipCodeValidation;

  await bankService.create(createBankDto);

  return res.status(201).json();
};