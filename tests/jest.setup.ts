import supertest from 'supertest';

import { allRoutes } from '../src/server/server';

export const routesServer = supertest(allRoutes);

export const beforeTest = () => {
  let token = '';
  beforeAll(async () => {
    await routesServer.post('/user').send({
      number: '1234',
      agency: '1234',
      name: 'LuanChaaa',
      cpf: '00100100101',
      email: 'emailinexistenteeeeee@gmail.com',
      password: 'senha',
      zipcode: '59800000',
    });

    const response = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '00100100101',
      password: 'senha',
    });

    token = response.body.token;
  });

  return token;
};

export const afterTest = (token: string) => {
  afterAll(async () => {
    await routesServer
      .delete('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({ password: 'senha' });
  });
};
