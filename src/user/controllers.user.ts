import { Request, Response } from 'express';
import { createAccountUserService, loginUserService } from './services.user';
import {
  bankErrorMessages,
  genericErrorMessages,
  userErrorMessages,
  userSucessMessage,
} from '../messages/messages';

export const createAccountUser = async (req: Request, res: Response) => {
  try {
    const result: number | Array<object> = await createAccountUserService(req);

    if (result === 404) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }

    if (result === 409) {
      return res
        .status(409)
        .json({ message: userErrorMessages.userAlreadyExist });
    }

    res.status(201).json();
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    {
      const result: number | string = await loginUserService(req);

      if (result === 404) {
        return res
          .status(404)
          .json({ message: userErrorMessages.userNotFound });
      }

      if (result === 401) {
        return res
          .status(401)
          .json({ message: userErrorMessages.userLoginInvalid });
      }

      res
        .status(200)
        .json({ message: `${userSucessMessage.logged}, token: ${result}` });
    }
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};
