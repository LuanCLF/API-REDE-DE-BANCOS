import { Request, Response, NextFunction } from 'express';
import { message } from '../../messages/messagerError';
import { CreateUser } from '../../interfaces/CreateUser';
import { callValidate } from '../utils/validateFields';
import { fieldsResponse } from '../utils/generateFieldsResponse';

export const midCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let phone = req.body.phoneNumber;
    if (phone) {
      if (isNaN(req.body.phoneNumber) || phone.length !== 11) {
        return res.status(404).json({
          mensagem:
            'O número de celular deve ser composto só por números e ter apenas os 11 digitos',
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
    const invalidBank = callValidate(bank);
    const invalidCreate = callValidate(createUser);
    if (!invalidCreate) {
      const responseInvalidFields = fieldsResponse(Object.keys(createUser));
      return res.status(404).json({
        mensagem: responseInvalidFields,
      });
    } else if (!invalidBank) {
      const responseInvalidFields = fieldsResponse(
        Object.keys(fieldsResponse(Object.keys(bank)))
      );
      return res.status(400).json({ mensagem: responseInvalidFields });
    }

    req.headers = {
      ...bank,
      ...createUser,
    };
    next();
  } catch (error) {
    res.status(500).json(message);
  }
};
