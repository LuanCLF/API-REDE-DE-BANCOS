import express from 'express';
import { userControllers } from '../user/index';

const routesUser = express();

routesUser.post(
  '/user',
  userControllers.midCreateUser,
  userControllers.createAccountUser
);
routesUser.post('/user/login', userControllers.loginUser);

routesUser.use('/user', userControllers.midUserLogin);

export { routesUser };
