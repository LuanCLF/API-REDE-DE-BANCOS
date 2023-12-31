import { routesServer } from '../jest.setup';

describe('account login', () => {
  it('try login but failed because bank not exist', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '123',
      agency: '123222',
      cpf: '03012320351',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(404);
  });
  it('tried to log in but failed because the password is incorrect', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '03012320347',
      password: 'senahahhahaah',
    });

    expect(user.statusCode).toEqual(401);
  });
  it('tried to log in but failed because the user does not exist in this bank', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '00000000000',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(404);
  });
  it('tried to log in and succeeded', async () => {
    const user = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '03012320347',
      password: 'senha',
    });

    expect(user.statusCode).toEqual(200);
  });
});
