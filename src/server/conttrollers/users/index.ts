import { createValidation, create } from './controllers/create';
import { loginValidation, login } from './controllers/login';
import {
  updateAllValidation,
  updateSomeValidation,
  update,
} from './controllers/logged/update';

export const user = {
  createValidation,
  create,
  loginValidation,
  login,
  updateAllValidation,
  updateSomeValidation,
  update,
};
