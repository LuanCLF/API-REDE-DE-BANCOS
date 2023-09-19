import { Request, Response, NextFunction } from 'express';
import {
  genericErrorMessages,
  midleErrorMessages,
} from '../../messages/messages';
import { CreateUser } from '../../interfaces/CreateUser';
import { callValidate } from '../utils/validateFields';
import { fieldsResponse } from '../utils/generateFieldsResponse';
import { passwordUserJWT } from '../../connection/conectDb';
import jwt from 'jsonwebtoken';

const midCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let phone = req.body.phoneNumber;
    if (phone) {
      if (isNaN(phone) || phone.length !== 11) {
        return res.status(400).json({
          message: midleErrorMessages.phoneInvalid,
        });
      }
    } else {
      phone = 'Não informado';
    }

    const createUser: CreateUser = {
      name: String(req.body.name),
      CPF: String(req.body.CPF),
      dateOfBirth: String(req.body.dateOfBirth),
      phoneNumber: phone,
      email: String(req.body.email),
      password: String(req.body.password),
    };
    const bank = {
      number: String(req.body.number),
      agency: String(req.body.agency),
    };

    const invalidCreate = callValidate(createUser);
    if (!invalidCreate) {
      const responseInvalidFields = fieldsResponse(Object.keys(createUser));
      return res.status(400).json({
        message: responseInvalidFields,
      });
    }

    const invalidBank = callValidate(bank);
    if (!invalidBank) {
      const responseInvalidFields = fieldsResponse(Object.keys(bank));
      return res.status(400).json({ message: responseInvalidFields });
    }

    req.headers = {
      ...bank,
      ...createUser,
    };
    next();
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

const midUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(401)
        .json({ message: genericErrorMessages.unauthorized });
    }

    const token = authorization.split(' ')[1];
    const auth = jwt.verify(token, passwordUserJWT);

    const user = JSON.parse(JSON.stringify(auth));
    req.body = {
      userID: user.id,
    };
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ menssage: genericErrorMessages.unauthorized });
  }
};

export { midCreateUser, midUserLogin };
