import { BankRepository } from '../../banks/repository/bank.repository';
import { ApiError } from '../../shared/middlewares/error';
import { hasher } from '../../shared/others/code/hasher';
import { validZipCode } from '../../shared/others/code/validZipCode';
import {
  bankErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';

import { CreateUserDto } from '../dtos/users.dtos';
import { UserRepository } from '../repository/user.repository';

export const CreateAccount = async (
  createUser: CreateUserDto
): Promise<void> => {
  const { number, agency, cpf, email, password, zipcode } = createUser;

  createUser.zipcode = await validZipCode(zipcode);
  createUser.password = await hasher(password);

  const bankRepository = new BankRepository();
  const bank = await bankRepository.findWithNumberAndAgency(number, agency);

  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const userRepository = new UserRepository();
  const result = await userRepository.findAccount(cpf, email, bank.id);

  if (result && result.length > 0) {
    throw new ApiError(userErrorMessages.userAlreadyExist, 409);
  }

  await userRepository.create(createUser, bank.id);
};
