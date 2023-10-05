import { Request, Response } from 'express';
import { validation } from '../../shared/middlewares/validation';
import { CreateUser } from '../dtos/users.dtos';
import * as yup from 'yup';
import { userService } from '../services/users.services';
import { validZipCode } from '../../shared/others/code/validZipCode';
import { prisma } from '../../../../database/prismaClient';

export const createValidation = validation((getSchema) => ({
  body: getSchema<CreateUser>(
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
  req: Request<{}, {}, CreateUser>,
  res: Response
) => {
  const zip = await validZipCode(req.body.zipcode);
  req.body.zipcode = zip;

  const service = new userService();

  await service.create(req.body);
  res.status(201).json();
};
