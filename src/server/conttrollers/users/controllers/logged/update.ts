import { validation } from '../../../shared/middlewares/validation';
import * as yup from 'yup';
import { UpdateUserDto } from '../../dtos/users.dtos';
import { Request, Response } from 'express';
import { hasher } from '../../../shared/others/code/hasher';
import { validZipCode } from '../../../shared/others/code/validZipCode';
import { Update } from '../../services/logged/update.services';

export const updateAllValidation = validation((getSchema) => ({
  body: getSchema<UpdateUserDto>(
    yup.object().shape({
      name: yup
        .string()
        .required()
        .min(4)
        .max(11)
        .matches(/^[a-zA-Z]+$/i),
      cpf: yup
        .string()
        .required()
        .min(11)
        .max(11)
        .matches(/^[0-9 ]+$/),
      phone_number: yup
        .string()
        .required()
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

export const updateSomeValidation = validation((getSchema) => ({
  body: getSchema<UpdateUserDto>(
    yup.object().shape({
      name: yup
        .string()
        .optional()
        .min(4)
        .max(11)
        .matches(/^[a-zA-Z]+$/i),
      cpf: yup
        .string()
        .optional()
        .min(11)
        .max(11)
        .matches(/^[0-9 ]+$/),
      phone_number: yup
        .string()
        .optional()
        .min(11)
        .max(11)
        .matches(/^[0-9]+$/),
      email: yup.string().min(10).max(50).optional(),
      password: yup.string().optional(),
      zipcode: yup
        .string()
        .optional()
        .min(8)
        .max(8)
        .matches(/^[0-9]+$/),
    })
  ),
}));

export const update = async (
  req: Request<{}, {}, UpdateUserDto>,
  res: Response
) => {
  const { userID } = req.headers;
  let { cpf, email, name, password, phone_number, zipcode } = req.body;

  if (password) {
    password = await hasher(password);
  }
  if (zipcode) {
    zipcode = await validZipCode(zipcode);
  }

  const updateUser = { cpf, email, name, password, phone_number, zipcode };
  await Update(Number(userID), updateUser);

  res.status(204).json();
};
