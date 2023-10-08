import { routesServer } from '../jest.setup';

describe('create an account at a bank', () => {
  it('tried to create an account but failed because the user already exists in this bank', async () => {
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
  it('tried to create an account but failed because the bank does not exist', async () => {
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
  it('tried to create an account but failed because the required data was not sent', async () => {
    const user = await routesServer.post('/user').send({
      number: '123222222222232',

      cpf: '03012320351',
      password: 'senha',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(400);
  });
});
