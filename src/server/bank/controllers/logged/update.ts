import { RequestHandler } from 'express';
import { genericErrorMessages } from '../../../messages/messages';
import * as yup from 'yup';
import { validation } from '../../middlewares/validation';
import { UpdateBankDto } from '../../../dtos/bank/banks.dtos';
import { getZipCode } from '../../../utils/getZipCode';
import { hasher } from '../../../utils/hasher';
import { bankLogged } from '../../services/service.bank.logged';

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
    if (values.length < 1) throw 400;

    const logged = new bankLogged(Number(bankID));
    await logged.update(values);

    return res.status(204).json();
  } catch (error) {
    switch (error) {
      case 404:
        return res.status(404).json({ message: genericErrorMessages.zipCode });
      case 400:
        return res
          .status(400)
          .json({ message: genericErrorMessages.requestEmpty });

      default:
        return res.status(500).json({ message: genericErrorMessages.intern });
    }
  }
};
