import { ApiError } from '../../../shared/middlewares/error';
import { dateFormat } from '../../../shared/others/code/dateFormat';
import { bankErrorMessages } from '../../../shared/others/messages/messages';
import { BankRepository } from '../../repository/bank.repository';

export const GetAllAccounts = async (id: number) => {
  const bankRepository = new BankRepository();

  const bankAccounts = await bankRepository.getAccountsOfBank(id);
  const bank = await bankRepository.findWithID(id);
  if (!bank || !bankAccounts) {
    throw new ApiError(bankErrorMessages.bankNotFound, 404);
  }

  const accounts = bankAccounts ? bankAccounts.accounts : false;
  if (accounts && accounts.length > 0) {
    accounts.map((object) => {
      const { updated_at, number, created_at, ...rest } = object;

      return { ...rest, created_at: dateFormat(created_at) };
    });
  }

  return { ...bank, accounts };
};
