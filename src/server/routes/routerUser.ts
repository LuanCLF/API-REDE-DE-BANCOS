import express from 'express';
import { user } from '../conttrollers/users';

const routesUser = express();

routesUser.post('/user', user.createValidation, user.create);

export { routesUser };
