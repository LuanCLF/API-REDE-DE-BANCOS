import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares/validation';
import { CreateUserDto } from '../dtos/users.dtos';
import * as yup from 'yup';
import { createAccount } from '../services/create.services';
import { validZipCode } from '../../shared/others/code/validZipCode';
import { hasher } from '../../shared/others/code/hasher';

export const createValidation = validation((getSchema) => ({
  body: getSchema<CreateUserDto>(
    yup.object().shape({
      number: yup
        .string()
        .required()
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .required()
        .matches(/^[0-9]+$/),
      name: yup
        .string()
        .required()
        .matches(/^[a-zA-Z]+$/i),
      cpf: yup
        .string()
        .required()
        .matches(/^[0-9 ]+$/),
      phone_number: yup
        .string()
        .optional()
        .matches(/^[0-9]+$/),
      email: yup.string().required(),
      password: yup.string().required(),
      zipcode: yup
        .string()
        .required()
        .min(8)
        .max(8)
        .matches(/^[0-9]+$/),
    })
  ),
}));

export const create = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response
) => {
  req.body.zipcode = await validZipCode(req.body.zipcode);
  req.body.password = await hasher(req.body.password);

  await createAccount(req.body);

  res.status(201).json();
};
