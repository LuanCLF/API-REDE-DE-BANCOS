import { routesServer } from '../jest.setup';

describe('login bank', () => {
  it('login failed due to invalid data', async () => {
    const login = await routesServer
      .post('/bank/login')
      .send({ nome: 'adssa' });

    expect(login.statusCode).toEqual(400);
  });

  it('login failed because bank not found', async () => {
    const login = await routesServer
      .post('/bank/login')
      .set('Content-Type', 'application/json')
      .send({
        number: '1232',
        agency:
          '1234544444444444444444444444444444444444444444444444444444444444',
        password: 'senhaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      });

    expect(login.statusCode).toEqual(404);
  });
  it('login failed due to incorrect password', async () => {
    const login = await routesServer
      .post('/bank/login')
      .set('Content-Type', 'application/json')
      .send({
        number: '123',
        agency: '123',
        password: 'senhaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      });

    expect(login.statusCode).toEqual(401);
  });

  it('login successful', async () => {
    const login = await routesServer
      .post('/bank/login')
      .set('Content-Type', 'application/json')
      .send({
        number: '123',
        agency: '123',
        password: 'senha',
      });

    expect(login.statusCode).toEqual(200);
  });
});
