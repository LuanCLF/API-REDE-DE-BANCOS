import { getAllBanks } from './getAllBanks';
import { deleteValidation, deleteBank } from './logged/delete';
import { registerValidation, registerBank } from './register';
import { loginValidation, loginBank } from './login';
import { getAccounts } from './logged/getAccounts';
import {
  updateAllValidation,
  updateSomeValidation,
  update,
} from './logged/update';
import { getMyBank } from './logged/getMyBank';
export const bank = {
  getAllBanks,
  registerValidation,
  registerBank,
  loginValidation,
  loginBank,
  getMyBank,
  getAccounts,
  updateAllValidation,
  updateSomeValidation,
  update,
  deleteValidation,
  deleteBank,
};
