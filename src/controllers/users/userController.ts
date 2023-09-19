import { Request, Response } from 'express';
import {
  createAccountUserService,
  loginUserService,
} from '../../services/userServices';
import {
  bankErrorMessages,
  genericErrorMessages,
  userErrorMessages,
} from '../../messages/messages';

const createAccountUser = async (req: Request, res: Response) => {
  try {
    const result: number | Array<object> = await createAccountUserService(req);

    if (result === 404) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }

    if (result === 400) {
      return res
        .status(404)
        .json({ mensagem: userErrorMessages.userAlreadyExist });
    }

    if (result === 500) {
      return res.status(500).json({ menssage: genericErrorMessages.intern });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    {
      const result = await loginUserService(req);

      if (result === 404) {
        return res
          .status(404)
          .json({ message: userErrorMessages.userNotFound });
      }

      if (result === 401) {
        return res
          .status(401)
          .json({ message: genericErrorMessages.unauthorized });
      }

      if (result === 500) {
        return res.status(500).json({ menssage: genericErrorMessages.intern });
      }
      res.send('adsd');
    }
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

export { createAccountUser, loginUser };
