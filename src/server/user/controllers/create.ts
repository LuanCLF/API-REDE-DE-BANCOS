import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares/validation';
import { CreateUserDto } from '../dtos/users.dtos';
import * as yup from 'yup';
import { CreateAccount } from '../services/create.services';
import { validZipCode } from '../../shared/others/code/validZipCode';
import { hasher } from '../../shared/others/code/hasher';

export const createValidation = validation((getSchema) => ({
  body: getSchema<CreateUserDto>(
    yup.object().shape({
      number: yup
        .string()
        .required()
        .min(4)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .min(4)
        .required()
        .matches(/^[0-9]+$/),
      name: yup
        .string()
        .required()
        .min(4)
        .max(20)
        .matches(/^[a-zA-Z]+$/i),
      cpf: yup
        .string()
        .required()
        .min(11)
        .max(11)
        .matches(/^[0-9 ]+$/),
      phone_number: yup
        .string()
        .optional()
        .min(11)
        .max(11)
        .matches(/^[0-9]+$/),
      email: yup.string().min(10).max(50).required(),
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
  const { number, agency, cpf, email, name, password, zipcode } = req.body;
  const createUser = { number, agency, cpf, email, name, password, zipcode };

  await CreateAccount(createUser);

  res.status(201).json();
};
