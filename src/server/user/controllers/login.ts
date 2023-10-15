import { Request, Response } from 'express';
import { LoginUserDto } from '../dtos/users.dtos';
import { validation } from '../../shared/middlewares/validation';
import * as yup from 'yup';
import { Login } from '../services/login.services';

export const loginValidation = validation((getSchema) => ({
  body: getSchema<LoginUserDto>(
    yup.object().shape({
      number: yup
        .string()
        .required()
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .required()
        .matches(/^[0-9]+$/),
      cpf: yup
        .string()
        .required()
        .matches(/^[0-9 ]+$/),
      password: yup.string().required(),
    })
  ),
}));

export const login = async (
  req: Request<{}, {}, LoginUserDto>,
  res: Response
) => {
  const { agency, cpf, number, password } = req.body;

  const token = await Login(number, agency, cpf, password);

  res.status(200).json({ token });
};
