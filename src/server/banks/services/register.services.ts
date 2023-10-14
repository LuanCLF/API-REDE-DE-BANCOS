import { ApiError } from '../../conttrollers/shared/middlewares/error';
import { genericErrorMessages } from '../../conttrollers/shared/others/messages/messages';
import { CreateBankDto } from '../dtos/banks.dtos';
import { validZipCode } from '../../conttrollers/shared/others/code/validZipCode';
import { hasher } from '../../conttrollers/shared/others/code/hasher';

import { BankRepository } from '../repositories/bank.repository';

export const Register = async (createBankDto: CreateBankDto): Promise<void> => {
  let { number, agency, password, zipcode } = createBankDto;

  createBankDto.zipcode = await validZipCode(zipcode);

  createBankDto.password = await hasher(password);

  const bankRepository = new BankRepository();

  const exist = await bankRepository.findWithNumberOrAgency(number, agency);
  if (exist) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await bankRepository.register(createBankDto);
};
