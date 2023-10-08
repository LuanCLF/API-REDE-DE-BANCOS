import { routesServer } from '../../jest.setup';

describe('get my account information', () => {
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

  it('tried to get my information and succeeded', async () => {
    const user = await routesServer
      .get('/user')
      .set({ authorization: `Bearer ${token}` });

    expect(user.statusCode).toEqual(200);
  });
});
