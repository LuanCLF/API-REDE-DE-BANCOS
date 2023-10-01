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

  it('tried to update my data but failed because Im unauthorized', async () => {
    const update = await routesServer.patch('/bank').send();

    expect(update.statusCode).toEqual(401);
  });

  it('tried to update my data but failed because Im not send anything', async () => {
    const update = await routesServer
      .patch('/bank')
      .set({ authorization: `Bearer ${token}` });

    expect(update.statusCode).toEqual(400);
  });
  it('tried to update my data but failed because zipcode is invalid', async () => {
    const update = await routesServer
      .patch('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({
        zipcode: '11111111',
      });

    expect(update.statusCode).toEqual(404);
  });
});