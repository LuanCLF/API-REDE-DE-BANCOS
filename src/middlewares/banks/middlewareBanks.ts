import { Request, Response, NextFunction } from 'express';
import { callValidateRegister } from '../utils/validateFields';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { Register } from '../../interfaces/BankRegister';
import { fieldsResponse } from '../utils/generateFieldsResponse';
import jwt from 'jsonwebtoken';
import { passwordBankJWT } from '../../connection/conectDb';
import { getBankWithID } from '../../utils/getDB';

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
    const invalid = callValidateRegister(register);
    if (!invalid) {
      const responseInvalidFields = fieldsResponse(Object.keys(register));
      return res.status(404).json({
        mensagem: responseInvalidFields,
      });
    }

    req.body = { ...register };

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

    const exist = await getBankWithID(bank.id);
    if (!exist) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }
    req.headers = {
      bankID: bank.id,
    };

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ menssage: genericErrorMessages.unauthorized });
  }
};

const midUpdateBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = String(req.body.name);
    const password = String(req.body.password);
    const insert = [];

    if (name === 'undefined' && password === 'undefined') {
      const str = fieldsResponse(['name', 'password']);
      const message = str.replace(' e ', ' ou ');
      return res.status(400).json({ message: message });
    }

    if (name !== 'undefined' && name.trim() !== '') {
      insert.push({ name });
    } else {
      insert.push({ name: false });
    }

    if (password !== 'undefined' && password.trim() !== '') {
      insert.push({ password });
    } else {
      insert.push({ password: false });
    }

    req.body = insert;
    next();
  } catch (error) {
    return res;
  }
};
export { midBankRegister, midBankLogin, midUpdateBank };
