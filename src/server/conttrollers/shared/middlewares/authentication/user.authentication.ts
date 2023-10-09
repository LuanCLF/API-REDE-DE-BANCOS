import { RequestHandler } from 'express';
import { ApiError } from '../error';
import {
  genericErrorMessages,
  userErrorMessages,
} from '../../others/messages/messages';
import jwt from 'jsonwebtoken';
import { passwordUserJWT } from '../../jwt/passwords';
import { prisma } from '../../../../../database/prismaClient';

export const midUserLogin: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const token = authorization.split(' ')[1];
  let auth: string | jwt.JwtPayload = '';

  try {
    auth = jwt.verify(token, passwordUserJWT);
  } catch (error) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const user = JSON.parse(JSON.stringify(auth));

  const userID = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      id: user.id,
    },
  });

  if (!userID) {
    throw new ApiError(userErrorMessages.userNotFound, 404);
  }

  req.headers = {
    userID: user.id,
  };

  next();
};
