import { routesServer } from '../../jest.setup';

describe('delete my bank', () => {
  let token = '';

  beforeAll(async () => {
    await routesServer.post('/bank').send({
      name: 'anedeguemon',
      number: '04040404',
      agency: '04040404',
      password: 'senha',
      zipcode: '59800000',
    });

    const response = await routesServer.post('/bank/login').send({
      number: '04040404',
      agency: '04040404',
      password: 'senha',
    });

    token = response.body.token;
  });

  it('tried to delete my bank, but failed because im unauthorized', async () => {
    const deleteBank = await routesServer.delete('/bank').send();

    expect(deleteBank.statusCode).toEqual(401);
  });

  it('tried to delete my bank, but failed because my password was incorrect', async () => {
    const deleteBank = await routesServer
      .delete('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'joanzin',
      });

    expect(deleteBank.statusCode).toEqual(401);
  });
  it('tried to delete my bank and succeeded', async () => {
    const deleteBank = await routesServer
      .delete('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'senha',
      });

    expect(deleteBank.statusCode).toEqual(204);
  });
});
