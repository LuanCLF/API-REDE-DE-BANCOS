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

  it('tried to update my data but failed because Im unauthorized', async () => {
    const update = await routesServer.put('/bank').send();

    expect(update.statusCode).toEqual(401);
  });

  it('tried to update my data but failed because Im not send anything', async () => {
    const update = await routesServer
      .put('/bank')
      .set({ authorization: `Bearer ${token}` });

    expect(update.statusCode).toEqual(400);
  });
  it('tried to update my data but failed because zipcode is invalid', async () => {
    const update = await routesServer
      .put('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        password: 'senha',
        number: '444444444444445454545',
        agency: '5555555555555555554',
        name: 'santander',
        zipcode: '11111111',
      });

    expect(update.statusCode).toEqual(404);
  });
});
