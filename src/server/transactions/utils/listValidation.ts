import { validation } from '../../shared/middlewares/validation';
import { ListDto } from '../dtos/transactions.dtos';
import * as yup from 'yup';

export const listValidation = validation((getSchema) => ({
  query: getSchema<ListDto>(
    yup.object().shape({
      page: yup.number().optional().moreThan(-1),
    })
  ),
}));
