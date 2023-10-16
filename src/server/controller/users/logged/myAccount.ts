import { RequestHandler } from 'express';
import { MyAccount } from '../../../services/users/logged/myAccount';

export const myAccount: RequestHandler = async (req, res) => {
  const { userID } = req.headers;

  const user = await MyAccount(Number(userID));

  res.status(200).json({ user });
};
