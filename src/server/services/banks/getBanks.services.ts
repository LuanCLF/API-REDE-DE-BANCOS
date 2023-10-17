import { dateFormat } from '../../shared/others/code/dateFormat';
import { IBank } from '../../entities/bank/bank.entities';
import { BankRepository } from '../../repositories/banks/bank.repository';

export const GetBanks = async (page: number): Promise<Array<IBank>> => {
  const bankRepository = new BankRepository();
  const banks = await bankRepository.getAllBanks(page);

  const banksFormat = banks.map((bank) => {
    const { created_at, ...rest } = bank;

    return { ...rest, created_at: dateFormat(new Date(bank.created_at)) };
  });

  return banksFormat;
};
