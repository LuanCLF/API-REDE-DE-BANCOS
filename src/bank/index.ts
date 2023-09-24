import {
  registerBank,
  loginBank,
  searchMyBank,
  getAllAccountsOfMyBank,
  deleteBank,
  updateDataBank,
} from './controllers/controllers.banks';
import {
  midBankRegister,
  midBankLogin,
  midUpdateBank,
} from './middlewares/middlewares.banks';

export const bank = {
  midBankRegister,
  midBankLogin,
  midUpdateBank,
  registerBank,
  loginBank,
  searchMyBank,
  getAllAccountsOfMyBank,
  deleteBank,
  updateDataBank,
};
