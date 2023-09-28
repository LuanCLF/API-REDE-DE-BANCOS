import { RequestHandler } from 'express';
import { genericErrorMessages } from '../../messages/messages';
import { BankService } from '../services/services.banks';

export const getAllBanks: RequestHandler = async (req, res) => {
  try {
    const service = new BankService();
    const banks = await service.getBanks();

    return res.status(200).json(banks);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
