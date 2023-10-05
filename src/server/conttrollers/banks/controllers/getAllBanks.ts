import { RequestHandler } from 'express';
import { dateFormat } from '../../shared/others/code/dateFormat';
import { GetBanks } from '../services/getBanks.services';

export const getAllBanks: RequestHandler = async (req, res) => {
  const banks = await GetBanks();

  const banksFormat = banks.map((bank) => {
    const { created_at, ...rest } = bank;

    return { ...rest, created_at: dateFormat(bank.created_at) };
  });

  return res.status(200).json(banksFormat);
};
