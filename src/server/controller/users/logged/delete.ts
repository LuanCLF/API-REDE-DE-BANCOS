import { Request, Response } from 'express';
import { validation } from '../../../shared/middlewares/validation';
import { DeleteUserDto } from '../../../dtos/users/users.dtos';

import * as yup from 'yup';
import { Delete } from '../../../services/users/logged/delete.services';

export const deleteValidation = validation((getSchema) => ({
  body: getSchema<DeleteUserDto>(
    yup.object().shape({
      password: yup.string().required(),
    })
  ),
}));

export const deleteUser = async (
  req: Request<{}, {}, DeleteUserDto>,
  res: Response
) => {
  const { userID } = req.headers;
  const { password } = req.body;

  await Delete(Number(userID), password);

  res.status(204).json();
};
