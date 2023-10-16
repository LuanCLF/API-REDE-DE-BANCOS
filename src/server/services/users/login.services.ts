import { passwordUserJWT } from '../../shared/jwt/passwords';
import { ApiError } from '../../shared/middlewares/error';
import { compareHashed } from '../../shared/others/code/hasher';
import {
  genericErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../repositories/users/user.repository';

export const Login = async (
  number: string,
  agency: string,
  cpf: string,
  password: string
): Promise<string> => {
  const userRepository = new UserRepository();
  const user = await userRepository.findUserForLogin(cpf, number, agency);

  if (!user) {
    throw new ApiError(userErrorMessages.userNotFound, 404);
  }
  const { password: passwordHashed, id } = user;

  const correct = await compareHashed(password, passwordHashed);

  if (!correct) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  const token = jwt.sign({ id }, passwordUserJWT, { expiresIn: '1h' });

  return token;
};
