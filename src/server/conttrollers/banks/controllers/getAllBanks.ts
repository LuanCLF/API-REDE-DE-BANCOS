import { RequestHandler } from 'express';
import { BankService } from '../services/banks.services';
import { dateFormat } from '../../shared/others/code/dateFormat';

export const getAllBanks: RequestHandler = async (req, res) => {
  const service = new BankService();

  const banks = await service.getBanks();

  const banksFormat = banks.map((bank) => {
    const { created_at, ...rest } = bank;

    return { ...rest, created_at: dateFormat(bank.created_at) };
  });

  return res.status(200).json(banksFormat);
};
