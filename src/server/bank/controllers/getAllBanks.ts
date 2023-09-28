import { RequestHandler } from 'express';
import { genericErrorMessages } from '../../messages/messages';
import { pool } from '../../enviroment/env';
import { dateFormat } from '../../utils/dateFormat';

export const getAllBanks: RequestHandler = async (req, res) => {
  try {
    const { rows: banks } = await pool.query(
      'select name, number, agency, zipcode, created_at from banks'
    );
    banks.map((bank) => {
      bank.created_at = dateFormat(bank.created_at);
    });

    return res.status(200).json(banks);
  } catch (error) {
    return res.status(500).json({ message: genericErrorMessages.intern });
  }
};
