import { RequestHandler } from 'express';
import { ListTransfers } from '../service/listTransfers.services';

export const listTransfers: RequestHandler = async (req, res) => {
  const { userID } = req.headers;
  const page = Number(req.query.page) || 0;

  let { originFrom } = req.query;
  originFrom = originFrom !== 'out' ? '' : 'out';

  const transfers = await ListTransfers(Number(userID), page, originFrom);

  res.status(200).json(transfers);
};
