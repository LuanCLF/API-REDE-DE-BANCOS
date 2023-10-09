import { validation } from '../shared/middlewares/validation';
import { DepositOrWithdrawalsDto } from './dtos/transactions.dtos';
import * as yup from 'yup';

export const validationValue = validation((getSchema) => ({
  body: getSchema<DepositOrWithdrawalsDto>(
    yup.object().shape({
      value: yup.number().required().moreThan(0),
    })
  ),
}));
