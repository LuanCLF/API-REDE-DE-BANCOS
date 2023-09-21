import express from 'express';

import { midCreateUser } from '../middlewares/users/middlewareUsers';
import { createAccountUser } from '../controllers/users/userController';
import { loginUser } from '../controllers/users/userController';

const routesUser = express();

routesUser.post('/user', midCreateUser, createAccountUser);
routesUser.post('/login/user', loginUser);

export { routesUser };
