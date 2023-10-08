import { routesServer } from '../../jest.setup';

describe('get my bank information', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '1234',
      agency: '1234',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('tried to get my bank, but im not authenticated', async () => {
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
