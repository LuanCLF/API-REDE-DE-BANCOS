import { RequestHandler } from 'express';
import { genericErrorMessages } from '../../../../messages/messages';
import * as yup from 'yup';
import { validation } from '../../middlewares/validation';
import { UpdateBankDto } from '../../dtos/banks.dtos';
import { bankLogged } from '../../services/service.bank.logged';
import { ApiError } from '../../middlewares/error';
import { hasher } from '../../../utils/hasher';
import { prisma } from '../../../../../database/prismaClient';
import { validZipCode } from '../../../utils/validZipCode';

export const updateAllValidation = validation((getSchema) => ({
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup.string().required().min(3).max(20),
      number: yup
        .string()
        .required()
        .min(3)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .required()
        .min(3)
        .matches(/^[0-9]+$/),
      password: yup.string().required().min(5),
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
  body: getSchema<UpdateBankDto>(
    yup.object().shape({
      name: yup.string().optional().min(3).max(20),
      number: yup
        .string()
        .optional()
        .min(3)
        .matches(/^[0-9]+$/),
      agency: yup
        .string()
        .optional()
        .min(3)
        .matches(/^[0-9]+$/),
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
  let { number, agency, name, zipcode, password } = req.body;

  if (number || agency) {
    const result: object | null = await prisma.bank.findFirst({
      select: {
        id: true,
      },
      where: {
        OR: [{ agency }, { number }],
      },
    });

    if (result) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }
  }

  if (zipcode) {
    const zipCodeValidation: string = await validZipCode(zipcode);
    zipcode = zipCodeValidation;
  }

  if (password) {
    const passwordHashed: string = await hasher(password);
    password = passwordHashed;
  }

  const values = { number, agency, name, zipcode, password };

  const logged = new bankLogged(Number(bankID));
  await logged.update(values);

  return res.status(204).json();
};
