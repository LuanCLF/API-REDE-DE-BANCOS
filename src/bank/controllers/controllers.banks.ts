import { getBank } from '../../utils/getFromDB';
import { pool } from '../../connection/conectDb';
import { Request, Response } from 'express';
import { LoginBankDto, CreateBankDto } from '../../dtos/bank/banks.dtos';
import { IBank, IBankValidate } from '../../entitys/bank/bank.entity';
import { BankService } from '../services/services.banks';
import {
  bankErrorMessages,
  bankSucessMessage,
  genericErrorMessages,
} from '../../messages/messages';
import * as yup from 'yup';
import { validation } from '../middlewares/middlewares.banks';

export const createValidation = validation((getSchema) => ({
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

const registerBank = async (
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

const loginBank = async (req: Request<{}, {}, LoginBankDto>, res: Response) => {
  try {
    const { number, agency, password } = req.body;

    const bank: IBankValidate | undefined = await getBank(number, agency);

    if (!bank) {
      return res
        .status(404)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }

    const bankService = new BankService(pool);
    const tokenBank = await bankService.login(password, bank);

    if (!tokenBank) {
      return res
        .status(401)
        .json({ message: genericErrorMessages.unauthorized });
    }

    return res
      .status(200)
      .json({ message: `${bankSucessMessage.logged}, Token: ${tokenBank}` });
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

const searchMyBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const bankService = new BankService(pool);
    const bank: IBank | undefined = await bankService.searchMyBank(
      Number(bankID)
    );

    if (!bank) {
      return res
        .status(404)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }
    const { password, ...restBank } = bank;

    return res.status(200).json(restBank);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

const getAllAccountsOfMyBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const bankService = new BankService(pool);

    const bank: IBank | undefined = await bankService.searchMyBank(
      Number(bankID)
    );
    if (!bank) {
      return res
        .status(404)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }

    const accounts = await bankService.getAllAccounts(Number(bankID));

    const { number, agency, name, zipcode } = bank;
    const bankAccounts = {
      number,
      agency,
      name,
      zipcode,
      accounts,
    };

    return res.status(200).json(bankAccounts);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

const updateDataBank = async (req: Request, res: Response) => {
  try {
    const { bankID } = req.headers;
    const values = req.body;
    const bankService = new BankService(pool);
    await bankService.update(Number(bankID), values);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

const deleteBank = async (req: Request, res: Response) => {
  const { bankID } = req.headers;
  const { password } = req.body;
  try {
    const bankService = new BankService(pool);
    await bankService.delete(Number(bankID), password);

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

export {
  registerBank,
  searchMyBank,
  getAllAccountsOfMyBank,
  updateDataBank,
  loginBank,
  deleteBank,
};
