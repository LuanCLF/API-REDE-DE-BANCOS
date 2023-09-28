import { getAllBanks } from './controllers/getAllBanks';
import { deleteValidation, deleteBank } from './controllers/logged/delete';
import { registerValidation, registerBank } from './controllers/register';
import { loginValidation, loginBank } from './controllers/login';
import { searchMyBank } from './controllers/logged/searchMyBank';
import { getAllAccountsOfMyBank } from './controllers/logged/getAllAccountsOfMyBank';
import { updateValidation, update } from './controllers/logged/update';

export const bank = {
  getAllBanks,
  registerValidation,
  registerBank,
  loginValidation,
  loginBank,
  searchMyBank,
  getAllAccountsOfMyBank,
  updateValidation,
  update,
  deleteValidation,
  deleteBank,
};
