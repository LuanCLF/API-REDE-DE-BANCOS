import { RequestHandler } from 'express';
import { passwordBankJWT } from '../../jwt/passwords';
import jwt from 'jsonwebtoken';
import { ApiError } from '../error';
import { prisma } from '../../../../database/prismaClient';
import {
  bankErrorMessages,
  genericErrorMessages,
} from '../../others/messages/messages';

const midBankLogin: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const token = authorization.split(' ')[1];

  let auth: string | jwt.JwtPayload = '';
  try {
    auth = jwt.verify(token, passwordBankJWT);
  } catch (error) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const bank = JSON.parse(JSON.stringify(auth));

  const bankID = await prisma.bank.findUnique({
    select: {
      id: true,
    },
    where: {
      id: bank.id,
    },
  });
  if (!bankID) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  req.headers = {
    bankID: bank.id,
  };

  next();
};

export { midBankLogin };
