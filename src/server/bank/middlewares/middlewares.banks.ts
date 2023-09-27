import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../messages/messages';
import jwt from 'jsonwebtoken';
import { passwordBankJWT } from '../../enviroment/env';
import { getBankWithID } from '../../utils/getFromDB';
import { IBank } from '../../entitys/bank/bank.entity';
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
      try {
        schema.validateSync(req[key as TField], {
          abortEarly: false,
        });
      } catch (err) {
        const yupErrors = err as ValidationError;

        let recordErrors: Record<string, string> = {};

        yupErrors.inner.forEach((err) => {
          if (!err.path) return;

          recordErrors[err.path] = err.message;
        });
        errorsResult[key] = recordErrors;
      }
    });

    if (Object.entries(errorsResult).length > 0) {
      return res.status(400).json(errorsResult);
    }

    next();
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

export { midBankLogin };
