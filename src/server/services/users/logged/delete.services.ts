import { ApiError } from '../../../shared/middlewares/error';
import { compareHashed } from '../../../shared/others/code/hasher';
import {
  genericErrorMessages,
  userErrorMessages,
} from '../../../shared/others/messages/messages';
import { UserRepository } from '../../../repositories/users/user.repository';

export const Delete = async (userID: number, password: string) => {
  const userRepository = new UserRepository();
  const user = await userRepository.findWithID(userID);

  if (!user) {
    throw new ApiError(userErrorMessages.userNotFound, 404);
  }

  const correct = await compareHashed(password, user?.password);
  if (!correct) {
    throw new ApiError(genericErrorMessages.unauthorized, 401);
  }

  await userRepository.delete(userID, user.accounts[0].number);
};
