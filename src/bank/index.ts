import {
  registerBank,
  loginBank,
  searchBank,
  getAllAccounts,
  deleteBank,
  updateDataBank,
} from './controllers.banks';
import {
  midBankRegister,
  midBankLogin,
  midUpdateBank,
} from './middlewares.banks';

export const bankControllers = {
  midBankRegister,
  midBankLogin,
  midUpdateBank,
  registerBank,
  loginBank,
  searchBank,
  getAllAccounts,
  deleteBank,
  updateDataBank,
};
