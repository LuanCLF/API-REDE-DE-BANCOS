import express from 'express';
import { user } from '../user';
import { midUserLogin } from '../shared/middlewares/authentication/user.authentication';

const routesUser = express();

routesUser.post('/user', user.createValidation, user.create);
routesUser.post('/user/login', user.loginValidation, user.login);

routesUser.use('/user', midUserLogin);
routesUser.get('/user', user.myAccount);

routesUser.put('/user', user.updateAllValidation, user.update);

routesUser.patch('/user', user.updateSomeValidation, user.update);

routesUser.delete('/user', user.deleteValidation, user.deleteUser);
export { routesUser };
