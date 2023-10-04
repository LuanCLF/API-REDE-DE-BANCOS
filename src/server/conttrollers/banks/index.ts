import { getAllBanks } from './controllers/getAllBanks';
import { deleteValidation, deleteBank } from './controllers/logged/delete';
import { registerValidation, registerBank } from './controllers/register';
import { loginValidation, loginBank } from './controllers/login';
import { getAllAccountsOfMyBank } from './controllers/logged/getAllAccountsOfMyBank';
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
  getAllAccountsOfMyBank,
  updateAllValidation,
  updateSomeValidation,
  update,
  deleteValidation,
  deleteBank,
};
