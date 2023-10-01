import { routesServer } from '../../jest.setup';

describe('update bank', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '12345',
      agency: '12345',
      password: 'senha',
    });

    token = response.body.message;
  });

  it('get accounts of my bank', async () => {
    const bank = await routesServer
      .get('/bank')
      .set({ authorization: `Bearer ${token}` });

    expect(bank.statusCode).toEqual(200);
  });
});
