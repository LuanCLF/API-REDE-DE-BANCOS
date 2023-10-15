import { CreateBankDto } from '../../dtos/banks.dtos';
import { BankRepository } from '../../repository/bank.repository';

export const Update = async (
  id: number,
  values: CreateBankDto
): Promise<void> => {
  const bankRepository = new BankRepository();
  await bankRepository.update(id, values);
};
