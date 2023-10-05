import { getAllBanks } from './controllers/getAllBanks';
import { deleteValidation, deleteBank } from './controllers/logged/delete';
import { registerValidation, registerBank } from './controllers/register';
import { loginValidation, loginBank } from './controllers/login';
import { getAccounts } from './controllers/logged/getAccounts';
import {
  updateAllValidation,
  updateSomeValidation,
  update,
} from './controllers/logged/update';
import { getMyBank } from './controllers/logged/getMyBank';
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
