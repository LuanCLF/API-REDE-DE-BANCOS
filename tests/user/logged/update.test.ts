import { routesServer } from '../../jest.setup';

describe('update user', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '03012320322',
      password: 'senha',
    });

    token = response.body.token;
  });
  it('tried to update but failed because im not authenticate', async () => {
    const user = await routesServer.patch('/user').send({
      cpf: '03012320322',
      password: 'senha',
      name: 'marina',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(401);
  });
  it('tried to update but failed because cpf already exist in this bank', async () => {
    const user = await routesServer
      .patch('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        cpf: '03012320322',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(409);
  });
  it('tried to update but failed because email already exist', async () => {
    const user = await routesServer
      .patch('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        email: 'clfluan07@gmail.com',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(409);
  });
  it('tried to update but failed because not send all necessary', async () => {
    const user = await routesServer
      .put('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        email: 'clfluan07@gmail.com',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(400);
  });
});
