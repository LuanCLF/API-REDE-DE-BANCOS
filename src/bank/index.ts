import { deleteValidation, deleteBank } from './controllers/delete';
import { registerValidation, registerBank } from './controllers/register';
import { loginValidation, loginBank } from './controllers/login';
import { searchMyBank } from './controllers/searchMyBank';
import { getAllAccountsOfMyBank } from './controllers/getAllAccountsOfMyBank';
import { updateValidation, update } from './controllers/update';

export const bank = {
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
