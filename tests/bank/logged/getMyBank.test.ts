import { routesServer } from '../../jest.setup';

describe('update bank', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '1234',
      agency: '1234',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('get my bank but Im not authenticate', async () => {
    const bank = await routesServer.get('/bank');

    expect(bank.statusCode).toEqual(401);
  });

  it('get my bank information', async () => {
    const bank = await routesServer
      .get('/bank')
      .set({ authorization: `Bearer ${token}` });

    expect(bank.statusCode).toEqual(200);
  });
});
