import { routesServer } from '../jest.setup';

describe('login bank', () => {
  it('tried to log but fail because data is invalid', async () => {
    const login = await routesServer
      .post('/bank/login')
      .send({ nome: 'adssa' });

    expect(login.statusCode).toEqual(400);
  });

  it('tried to login but fail because bank not exist', async () => {
    const login = await routesServer
      .post('/bank/login')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '1232',
        agency: '123a',
        password: 'senha',
        zipcode: '59800000',
      });

    expect(login.statusCode).toEqual(404);
  });
  it('tried to login but fail because password incorret', async () => {
    const login = await routesServer
      .post('/bank/login')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '123',
        agency: '123',
        password: 'senhaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        zipcode: '59800000',
      });

    expect(login.statusCode).toEqual(401);
  });
});
