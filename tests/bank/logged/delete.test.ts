import { routesServer } from '../../jest.setup';

describe('delete my bank', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/bank/login').send({
      number: '1234',
      agency: '1234',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('tried to delete my bank, but failed because im unauthorized', async () => {
    const deleteBank = await routesServer.delete('/bank').send();

    expect(deleteBank.statusCode).toEqual(401);
  });

  it('tried to delete my bank, but failed because im unauthorized', async () => {
    const deleteBank = await routesServer
      .delete('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'joanzin',
      });

    expect(deleteBank.statusCode).toEqual(401);
  });
});
