import { Request, Response, NextFunction } from 'express';
import { field } from '../utils/validateFields';
import { message } from '../../messages/messagerError';

export const midBankFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { number, agency, name, password } = req.body;

    const empty = field(number, 'number');
    const empty2 = field(agency, 'agency');
    const empty3 = field(name, 'name');
    const empty4 = field(password, 'password');

    if (empty || empty2 || empty3 || empty4) {
      return res.status(404).json({
        mensagem:
          'É necessário que preencha os campos de name, agency, number e password. A agency e number devem ser compostos somente por números',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(message);
  }
};
