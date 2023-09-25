import { Request, Response, NextFunction, RequestHandler } from 'express';
import { callValidateRegister } from '../../utils/validateFields';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import { fieldsResponse } from '../../utils/generateFieldsResponse';
import jwt from 'jsonwebtoken';
import { passwordBankJWT } from '../../connection/conectDb';
import { getBankWithID } from '../../utils/getFromDB';
import { CreateBankDto } from '../../dtos/bank/banks.dtos';
import { IBank } from '../../entitys/bank/bank.entity';
import { getZipCode } from '../../utils/getZipCode';
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup';

type TField = 'body' | 'header' | 'query' | 'params';

type TGetSchema = <T extends Maybe<AnyObject>>(
  schema: ObjectSchema<T>
) => ObjectSchema<T>;
type TAllSchemas = Record<TField, ObjectSchema<any>>;
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>;
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler;

export const validation: TValidation =
  (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas((schema) => schema);

    const errorsResult: Record<string, Record<string, string>> = {};

    Object.entries(schemas).forEach(([key, schema]) => {
      const recordErrors: Record<string, string> = {};

      try {
        schema.validateSync(req[key as TField], {
          abortEarly: false,
        });
        return next();
      } catch (err) {
        const yupErrors = err as ValidationError;

        const recordErrors: Record<string, string> = {};

        yupErrors.inner.forEach((err) => {
          if (!err.path) return;
          recordErrors[err.path] = err.message;
        });
      }
      errorsResult[key] = recordErrors;
    });
    if (Object.entries(errorsResult).length > 0) {
      return res.status(500).json(errorsResult);
    }

    next();
  };

const midBankRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const register: CreateBankDto = {
      number: String(req.body.number),
      agency: String(req.body.agency),
      name: String(req.body.name),
      password: String(req.body.password),
      zipcode: String(req.body.zipcode),
    };

    const invalid = callValidateRegister(register);
    if (!invalid) {
      const responseInvalidFields = fieldsResponse(Object.keys(register));
      return res.status(404).json({
        messagem: responseInvalidFields,
      });
    }

    let zip: string | undefined = await getZipCode(register.zipcode);
    if (!zip) {
      return res.status(400).json({ message: genericErrorMessages.zipCode });
    }

    register.zipcode = zip;
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
    const exist: IBank | undefined = await getBankWithID(bank.id);
    if (!exist) {
      return res.status(404).json({ message: bankErrorMessages.bankNotFound });
    }
    req.headers = {
      bankID: bank.id,
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.unauthorized });
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

    let zip: string | undefined = await getZipCode(req.body.zipcode);
    if (zip) {
      insert.push({ zipcode: zip });
    } else {
      insert.push({ zipcode: false });
    }
    if (name === 'undefined' && password === 'undefined' && !zip) {
      const str = fieldsResponse(['name', 'password', 'zipcode']);
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
