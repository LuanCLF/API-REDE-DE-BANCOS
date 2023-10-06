import { createValidation, create } from './controllers/create';
import { loginValidation, login } from './controllers/login';

export const user = {
  createValidation,
  create,

  loginValidation,
  login,
};
