import { RequestHandler } from 'express';
import * as yup from 'yup';
import { validation } from '../../../shared/middlewares/validation';
import { UpdateBankDto } from '../../../dtos/banks/banks.dtos';

import { Update } from '../../../services/banks/logged/update.services';

export const updateAllValidation = validation((getSchema) => ({
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup
        .string()
        .required()
        .min(3)
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

export const updateSomeValidation = validation((getSchema) => ({
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup.string().optional().min(3).max(20),
      number: yup
        .string()
        .optional()
        .min(3)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .optional()
        .min(3)
        .matches(/^[0-9]+$/),
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
  const { bankID } = req.headers;
  let { number, agency, name, zipcode, password } = req.body;

  const updateBankDto: UpdateBankDto = {
    number,
    agency,
    name,
    zipcode,
    password,
  };

  await Update(Number(bankID), updateBankDto);

  return res.status(204).json();
};
