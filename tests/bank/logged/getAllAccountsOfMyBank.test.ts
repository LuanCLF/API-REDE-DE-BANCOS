import { routesServer } from '../../jest.setup';

describe('update bank', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '123',
      agency: '123',
      password: 'senha',
    });

    token = response.body.message;
  });

  it('get all accounts of my bank but Im not authenticate', async () => {
    const bank = await routesServer.get('/bank');

    expect(bank.statusCode).toEqual(401);
  });

  it('get accounts of my bank', async () => {
    const bank = await routesServer
      .get('/bank')
      .set({ authorization: `Bearer ${token}` });

    expect(bank.statusCode).toEqual(200);
  });
});
