import { RequestHandler } from 'express';
import { BankService } from '../../services/services.banks';
import { pool } from '../../../enviroment/env';
import { genericErrorMessages } from '../../../messages/messages';
import * as yup from 'yup';
import { validation } from '../../middlewares/middlewares.banks';
import { UpdateBankDto } from '../../../dtos/bank/banks.dtos';
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
  try {
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
    if (values.length < 1) throw 'EMPTY';

    const bankService = new BankService(pool);
    await bankService.update(Number(bankID), values);

    return res.status(204).json();
  } catch (error) {
    if (error === 'ZIPCODE') {
      return res.status(404).json({ message: genericErrorMessages.zipCode });
    }
    if (error === 'EMPTY') {
      return res
        .status(400)
        .json({ message: genericErrorMessages.requestEmpty });
    }

    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
