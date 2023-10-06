import express from 'express';
import { user } from '../conttrollers/users';
import { midUserLogin } from '../conttrollers/shared/middlewares/authentication/user.authentication';

const routesUser = express();

routesUser.post('/user', user.createValidation, user.create);
routesUser.post('/user/login', user.loginValidation, user.login);

routesUser.use('/user', midUserLogin);

export { routesUser };
