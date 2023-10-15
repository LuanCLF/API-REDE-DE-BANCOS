import { ApiError } from '../../../shared/middlewares/error';
import { hasher } from '../../../shared/others/code/hasher';
import { validZipCode } from '../../../shared/others/code/validZipCode';
import { genericErrorMessages } from '../../../shared/others/messages/messages';
import { UpdateUserDto } from '../../dtos/users.dtos';
import { UserRepository } from '../../repository/user.repository';

export const Update = async (userID: number, updateUserDto: UpdateUserDto) => {
  let { cpf, email, password, zipcode } = updateUserDto;

  if (password) {
    updateUserDto.password = await hasher(password);
  }
  if (zipcode) {
    updateUserDto.zipcode = await validZipCode(zipcode);
  }

  const userRepository = new UserRepository();
  const bankID = await userRepository.findBankIdOfMyAccount(userID);

  if (bankID && cpf) {
    const result = await userRepository.checkIfUserAlreadyExistWithCpf(
      cpf,
      bankID
    );

    if (result) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }
  }

  if (email) {
    const result = await userRepository.checkIfUserAlreadyExistWithEmail(email);

    if (result) {
      throw new ApiError(genericErrorMessages.unauthorized, 409);
    }
  }

  await userRepository.update(userID, updateUserDto);
};
