import { BankRepository } from '../../repositories/banks/bank.repository';
import { ApiError } from '../../shared/middlewares/error';
import { hasher } from '../../shared/others/code/hasher';
import { validZipCode } from '../../shared/others/code/validZipCode';
import {
  bankErrorMessages,
  userErrorMessages,
} from '../../shared/others/messages/messages';

import { CreateUserDto } from '../../dtos/users/users.dtos';
import { UserRepository } from '../../repositories/users/user.repository';
import { IAcountCreate } from '../../entities/user/user.entities';

export const CreateAccount = async (
  createUserDto: CreateUserDto
): Promise<void> => {
  const { number, agency, cpf, email, password, zipcode, name, phone_number } =
    createUserDto;

  const createUser: IAcountCreate = {
    cpf,
    email,
    password,
    zipcode,
    name,
    phone_number,
  };

  createUser.zipcode = await validZipCode(zipcode);
  createUser.password = await hasher(password);

  const bankRepository = new BankRepository();
  const bank = await bankRepository.findWithNumberAndAgency(number, agency);

  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const userRepository = new UserRepository();
  const result = await userRepository.findAccounts(cpf, email, bank.id);

  if (result && result.accounts.length > 0) {
    throw new ApiError(userErrorMessages.userAlreadyExist, 409);
  }

  await userRepository.create(createUser, bank.id);
};