import { RequestHandler } from 'express';
import { genericErrorMessages } from '../../../../messages/messages';
import * as yup from 'yup';
import { validation } from '../../middlewares/validation';
import { UpdateBankDto } from '../../../../dtos/bank/banks.dtos';
import { bankLogged } from '../../services/service.bank.logged';
import { ApiError } from '../../middlewares/error';
import { getZipCode } from '../../../utils/getZipCode';
import { hasher } from '../../../utils/hasher';

export const updateValidation = validation((getSchema) => ({
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup.string().optional().min(3).max(20),
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
  const { zipcode, password } = req.body;
  if (zipcode) {
    const zipCodeValidation: string = await getZipCode(zipcode);
    req.body.zipcode = zipCodeValidation;
  }
  if (password) {
    const passwordHashed: string = await hasher(password);
    req.body.password = passwordHashed;
  }

  const values: Array<Array<string>> = Object.entries(req.body);
  if (values.length < 1) {
    throw new ApiError(genericErrorMessages.requestEmpty, 400);
  }

  const logged = new bankLogged(Number(bankID));
  await logged.update(values);

  return res.status(204).json();
};
