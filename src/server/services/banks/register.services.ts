import { ApiError } from '../../shared/middlewares/error';
import { genericErrorMessages } from '../../shared/others/messages/messages';
import { CreateBankDto } from '../../dtos/banks/banks.dtos';
import { validZipCode } from '../../shared/others/code/validZipCode';
import { hasher } from '../../shared/others/code/hasher';

import { BankRepository } from '../../repositories/banks/bank.repository';

export const Register = async (createBankDto: CreateBankDto): Promise<void> => {
  let { number, agency, password, zipcode } = createBankDto;

  createBankDto.zipcode = await validZipCode(zipcode);

  createBankDto.password = await hasher(password);

  const bankRepository = new BankRepository();

  const exist = await bankRepository.checkIfExistWithNumberOrAgency(
    number,
    agency
  );
  if (exist) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  await bankRepository.register(createBankDto);
};
