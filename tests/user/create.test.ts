import { routesServer } from '../jest.setup';

describe('create account in a bank', () => {
  it('try create accounts but failed because user already exist in this bank', async () => {
    const user = await routesServer.post('/user').send({
      number: '1234',
      agency: '1234',
      name: 'Luan',
      cpf: '03012320351',
      email: 'clfluan06@gmail.com',
      password: 'senha',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(409);
  });
  it('try create accounts but failed because bank not exist', async () => {
    const user = await routesServer.post('/user').send({
      number: '123222222222232',
      agency: '1233222222222222222222222',
      name: 'Luan',
      cpf: '03012320351',
      email: 'clfluan06@gmail.com',
      password: 'senha',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(404);
  });
  it('try create accounts but failed because required data not send', async () => {
    const user = await routesServer.post('/user').send({
      number: '123222222222232',

      cpf: '03012320351',
      password: 'senha',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(400);
  });
});
