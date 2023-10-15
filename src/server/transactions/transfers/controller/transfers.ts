import { validation } from '../../../shared/middlewares/validation';
import * as yup from 'yup';
import { TransferDto } from '../../dtos/transactions.dtos';
import { RequestHandler } from 'express';
import { ApiError } from '../../../shared/middlewares/error';
import { transferErrorMessage } from '../../../shared/others/messages/messages';
import { Transfer } from '../service/transfers.services';

export const tranferValidation = validation((getSchema) => ({
  body: getSchema<TransferDto>(
    yup.object().shape({
      value: yup.number().required().moreThan(0),
      destinationUserID: yup.number().optional().moreThan(0),
      destinationUserEmail: yup.string().optional().min(5).max(50),
    })
  ),
}));

export const transfer: RequestHandler = async (req, res) => {
  const { userID } = req.headers;
  const {
    value,
    destinationUserID: toUserID,
    destinationUserEmail: toEmail,
  } = req.body;

  if (!toUserID && !toEmail) {
    throw new ApiError(transferErrorMessage.sendSomething, 400);
  }

  const user = await Transfer(Number(userID), value, toUserID, toEmail);

  res.send(user);
};
