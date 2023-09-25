import { Request, Response } from 'express';

import { CreateBankDto } from '../../dtos/bank/banks.dtos';
import { validation } from '../middlewares/middlewares.banks';

import { IBankValidate } from '../../entitys/bank/bank.entity';
import { getBank } from '../../utils/getFromDB';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { BankService } from '../services/services.banks';
import { pool } from '../../connection/conectDb';

import * as yup from 'yup';

export const registerValidation = validation((getSchema) => ({
  body: getSchema<CreateBankDto>(
    yup.object().shape({
      name: yup.string().required().min(3),
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

export const registerBank = async (
  req: Request<{}, {}, CreateBankDto>,
  res: Response
) => {
  try {
    const createBankDto: CreateBankDto = {
      ...req.body,
    };
    const bank: IBankValidate | undefined = await getBank(
      createBankDto.number,
      createBankDto.agency
    );

    if (bank !== undefined) {
      return res
        .status(400)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }

    const bankService = new BankService(pool);
    await bankService.create(createBankDto);

    return res.status(201).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
