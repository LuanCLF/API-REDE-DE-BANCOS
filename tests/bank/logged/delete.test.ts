import { routesServer } from '../../jest.setup';

describe('delete my bank', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '123',
      agency: '123',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('tried to delete my bank but failed because Im unauthorized', async () => {
    const deleteBank = await routesServer.delete('/bank').send();

    expect(deleteBank.statusCode).toEqual(401);
  });

  it('tried to delete my bank but failed because my password is incorrect', async () => {
    const deleteBank = await routesServer
      .delete('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'joanzin',
      });

    expect(deleteBank.statusCode).toEqual(401);
  });
});
