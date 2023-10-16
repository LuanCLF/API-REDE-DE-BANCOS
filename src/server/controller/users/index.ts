import { createValidation, create } from './create';
import { loginValidation, login } from './login';
import {
  updateAllValidation,
  updateSomeValidation,
  update,
} from './logged/update';
import { deleteValidation, deleteUser } from './logged/delete';
import { myAccount } from './logged/myAccount';

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
