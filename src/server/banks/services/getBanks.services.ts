import { dateFormat } from '../../conttrollers/shared/others/code/dateFormat';
import { IBank } from '../entities/bank.entities';
import { BankRepository } from '../repositories/bank.repository';

export const GetBanks = async (): Promise<Array<IBank>> => {
  const bankRepository = new BankRepository();
  const banks = await bankRepository.getAllBanks();

  const banksFormat = banks.map((bank) => {
    const { created_at, ...rest } = bank;

    return { ...rest, created_at: dateFormat(new Date(bank.created_at)) };
  });

  return banksFormat;
};
