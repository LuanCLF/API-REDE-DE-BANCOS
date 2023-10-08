import { routesServer } from '../../jest.setup';

describe('delete account', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '02302302332',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('tried to delete an account but not authenticated', async () => {
    const user = await routesServer.delete('/user').send({
      password: 'senha',
    });

    expect(user.statusCode).toEqual(401);
  });
  it('tried to delete an account but password is incorrect', async () => {
    const user = await routesServer
      .delete('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'senhahaahnaha',
      });

    expect(user.statusCode).toEqual(401);
  });
});
