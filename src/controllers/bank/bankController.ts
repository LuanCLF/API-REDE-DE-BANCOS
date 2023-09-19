import { Request, Response } from 'express';
import {
  getAllAccountsService,
  loginBankService,
  registerBankService,
  // updateDataBankService,
} from '../../services/bank/bankServices';
import {
  bankErrorMessages,
  bankSucessMessage,
  genericErrorMessages,
} from '../../messages/messages';

const registerBank = async (req: Request, res: Response) => {
  try {
    const result: number = await registerBankService(req);

    if (result === 400) {
      return res
        .status(400)
        .json({ message: bankErrorMessages.bankAlreadyExist });
    }

    if (result === 500) {
      return res.status(500).json({ message: genericErrorMessages.intern });
    }
    res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

const loginBank = async (req: Request, res: Response) => {
  try {
    {
      const result: number | string = await loginBankService(req);

      if (result === 404) {
        return res
          .status(404)
          .json({ message: bankErrorMessages.bankNotFound });
      }

      if (result === 401) {
        return res
          .status(401)
          .json({ message: genericErrorMessages.unauthorized });
      }

      if (result === 500) {
        return res.status(500).json({ menssage: genericErrorMessages.intern });
      }

      res
        .status(200)
        .json({ message: `${bankSucessMessage.logged} Token:'${result}'` });
    }
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const result: number | object = await getAllAccountsService(req);

    if (result === 404) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }

    if (result === 401) {
      return res
        .status(401)
        .json({ message: genericErrorMessages.unauthorized });
    }

    if (result === 500) {
      return res.status(500).json({ message: genericErrorMessages.intern });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};

// const updateDataBank = async (req: Request, res: Response) => {
//   try {
//     const result = await updateDataBankService(req);
//     return res.send(result);
//   } catch (error) {
//     return res.status(500).json({ message: genericErrorMessages.intern });
//   }
// };

export { registerBank, loginBank, getAllAccounts };
