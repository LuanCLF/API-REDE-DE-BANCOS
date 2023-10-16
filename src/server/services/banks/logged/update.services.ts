import { UpdateBankDto } from '../../../dtos/banks/banks.dtos';
import { BankRepository } from '../../../repositories/banks/bank.repository';
import { ApiError } from '../../../shared/middlewares/error';
import { hasher } from '../../../shared/others/code/hasher';
import { validZipCode } from '../../../shared/others/code/validZipCode';
import { genericErrorMessages } from '../../../shared/others/messages/messages';

export const Update = async (
  id: number,
  updateBankDto: UpdateBankDto
): Promise<void> => {
  const { number, agency, zipcode, password } = updateBankDto;

  const bankRepository = new BankRepository();

  const bank = await bankRepository.checkIfExistWithNumberOrAgency(
    number,
    agency
  );

  if (bank) {
    throw new ApiError(genericErrorMessages.unauthorized, 409);
  }

  if (zipcode) {
    const zipCodeValidation: string = await validZipCode(zipcode);
    updateBankDto.zipcode = zipCodeValidation;
  }

  if (password) {
    const passwordHashed: string = await hasher(password);
    updateBankDto.password = passwordHashed;
  }

  await bankRepository.update(id, updateBankDto);
};
