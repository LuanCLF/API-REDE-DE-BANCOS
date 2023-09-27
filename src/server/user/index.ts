import { createAccountUser, loginUser } from './controllers.user';
import { midUserLogin, midCreateUser } from './middlewares.user';

export const userControllers = {
  midCreateUser,
  midUserLogin,
  createAccountUser,
  loginUser,
};
