import { Request, Response } from 'express';
import { validation } from '../../../conttrollers/shared/middlewares/validation';
import * as yup from 'yup';

import { DeleteBankDto } from '../../dtos/banks.dtos';
import { Delete } from '../../services/logged/delete.services';

export const deleteValidation = validation((getSchema) => ({
  body: getSchema<DeleteBankDto>(
    yup.object().shape({
      password: yup.string().required().min(5),
    })
  ),
}));

const deleteBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;
  const { password } = req.body;

  await Delete(Number(bankID), password);

  return res.status(204).json();
};

export { deleteBank };
