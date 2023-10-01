import { Request, Response } from 'express';
import { validation } from '../../middlewares/validation';
import * as yup from 'yup';
import { bankLogged } from '../../services/service.bank.logged';
import { DeleteBankDto } from '../../../../dtos/bank/banks.dtos';

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

  const logged = new bankLogged(Number(bankID));
  await logged.delete(password);

  return res.status(204).json();
};

export { deleteBank };
