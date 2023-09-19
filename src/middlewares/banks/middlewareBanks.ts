import { Request, Response, NextFunction } from 'express';
import { callValidate } from '../utils/validateFields';
import { genericErrorMessages } from '../../messages/messages';
import { Register } from '../../interfaces/BankRegister';
import { fieldsResponse } from '../utils/generateFieldsResponse';
import jwt from 'jsonwebtoken';
import { passwordBankJWT } from '../../connection/conectDb';

const midBankRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const register: Register = {
      number: String(req.body.number),
      agency: String(req.body.agency),
      name: String(req.body.name),
      password: String(req.body.password),
    };
    const invalid = callValidate(register);
    if (!invalid) {
      const responseInvalidFields = fieldsResponse(Object.keys(register));
      return res.status(404).json({
        mensagem: responseInvalidFields,
      });
    }

    req.headers = { ...register };

    next();
  } catch (error) {
    return res.status(500).json({ menssage: genericErrorMessages.intern });
  }
};

const midBankLogin = async (
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
    const auth = jwt.verify(token, passwordBankJWT);

    const bank = JSON.parse(JSON.stringify(auth));
    req.body = {
      bankID: bank.id,
      number: bank.number,
      agency: bank.agency,
    };
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ menssage: genericErrorMessages.unauthorized });
  }
};

export { midBankRegister, midBankLogin };
