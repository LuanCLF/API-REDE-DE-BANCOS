import { getAllBanks } from '../../banks/controllers/getAllBanks';
import {
  deleteValidation,
  deleteBank,
} from '../../banks/controllers/logged/delete';
import {
  registerValidation,
  registerBank,
} from '../../banks/controllers/register';
import { loginValidation, loginBank } from '../../banks/controllers/login';
import { getAccounts } from '../../banks/controllers/logged/getAccounts';
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
