import { IBank } from '../../entities/bank.entities';
import { ApiError } from '../../../conttrollers/shared/middlewares/error';
import { bankErrorMessages } from '../../../conttrollers/shared/others/messages/messages';
import { BankRepository } from '../../repositories/bank.repository';
import { dateFormat } from '../../../conttrollers/shared/others/code/dateFormat';

export const GetMyBank = async (id: number): Promise<Partial<IBank>> => {
  const bankRepository = new BankRepository();
  const bank = await bankRepository.findWithID(id);
  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }
  const { created_at: date, ...rest } = bank;

  const bankFormated = {
    ...rest,
    created_at: dateFormat(new Date(date || new Date())),
  };

  return bankFormated;
};
