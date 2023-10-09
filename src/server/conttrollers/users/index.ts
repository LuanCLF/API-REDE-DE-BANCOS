import { createValidation, create } from './controllers/create';
import { loginValidation, login } from './controllers/login';
import {
  updateAllValidation,
  updateSomeValidation,
  update,
} from './controllers/logged/update';
import { deleteValidation, deleteUser } from './controllers/logged/delete';
import { myAccount } from './controllers/logged/myAccount';

export const user = {
  createValidation,
  create,
  loginValidation,
  login,
  updateAllValidation,
  updateSomeValidation,
  update,
  deleteValidation,
  deleteUser,
  myAccount,
};
