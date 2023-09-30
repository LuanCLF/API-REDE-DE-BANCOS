import { RequestHandler } from 'express';
import { BankService } from '../services/services.banks';

export const getAllBanks: RequestHandler = async (req, res) => {
  const service = new BankService();
  const banks = await service.getBanks();

  return res.status(200).json(banks);
};
