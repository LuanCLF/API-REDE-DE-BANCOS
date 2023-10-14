import { ApiError } from '../../../conttrollers/shared/middlewares/error';
import { dateFormat } from '../../../conttrollers/shared/others/code/dateFormat';
import { bankErrorMessages } from '../../../conttrollers/shared/others/messages/messages';
import { BankRepository } from '../../repositories/bank.repository';

export const GetAllAccounts = async (id: number) => {
  const bankRepository = new BankRepository();

  const bank = await bankRepository.getAccountsOfBank(id);
  if (!bank) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }
  if (bank.accounts.length > 0) {
    bank.accounts.map((object) => {
      const { updated_at, number, created_at, ...rest } = object;

      return { ...rest, created_at: dateFormat(created_at) };
    });
  }

  return bank;
};
