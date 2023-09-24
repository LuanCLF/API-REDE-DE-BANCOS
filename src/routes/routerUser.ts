import express from 'express';
import { userControllers } from '../user/index';

const routesUser = express();

routesUser.post(
  '/user',
  userControllers.midCreateUser,
  userControllers.createAccountUser
);
routesUser.post('/login/user', userControllers.loginUser);

routesUser.use(userControllers.midUserLogin);

export { routesUser };
