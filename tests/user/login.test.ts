import { routesServer } from '../jest.setup';

describe('try login', () => {
  it('try login but failed because bank not exist', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '123',
      agency: '123222',
      cpf: '03012320351',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(404);
  });
  it('try login but failed because password incorrect', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '123',
      agency: '123',
      cpf: '03012320351',
      password: 'senahahhahaah',
    });

    expect(user.statusCode).toEqual(401);
  });
  it('try login but failed because user not exist in this bank', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '123',
      agency: '123',
      cpf: '03012345752',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(404);
  });
  it('Try to login and get', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '123',
      agency: '123',
      cpf: '03012320351',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(200);
  });
});
