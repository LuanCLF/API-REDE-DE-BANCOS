import { routesServer } from '../../jest.setup';

describe('update user', () => {
  let token = '';

  beforeAll(async () => {
    await routesServer.post('/user').send({
      number: '1234',
      agency: '1234',
      name: 'Luan',
      cpf: '01001001012',
      email: 'emailinexistenteeeeee@gmail.com',
      password: 'senha',
      zipcode: '01001000',
    });

    const response = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '01001001012',
      password: 'senha',
    });

    token = response.body.token;
  });

  afterAll(async () => {
    await routesServer
      .delete('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({ password: 'senha' });
  });

  it('tried to update but failed because im not authenticated', async () => {
    const user = await routesServer.patch('/user').send({
      cpf: '02302302332',
      password: 'senha',
      name: 'marina',
      zipcode: '01001000',
    });
    expect(user.statusCode).toEqual(401);
  });
  it('tried to update but failed because the CPF already exists in this bank', async () => {
    const user = await routesServer
      .patch('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        cpf: '02302302332',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(409);
  });
  it('tried to update but failed because email already exists', async () => {
    const user = await routesServer
      .patch('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        email: 'clfluan07@gmail.com',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(409);
  });
  it('tried to update but failed because not all necessary information was sent', async () => {
    const user = await routesServer
      .put('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        email: 'clfluan07@gmail.com',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });
    expect(user.statusCode).toEqual(400);
  });
  it('tried to update and succeeded', async () => {
    const user = await routesServer
      .put('/user')
      .set({ authorization: `Bearer ${token}` })
      .send({
        cpf: '10110110110',
        phone_number: '84988495843',
        email: 'lalalalallallalal@gmail.com',
        password: 'senha',
        name: 'marina',
        zipcode: '01001000',
      });

    expect(user.statusCode).toEqual(204);
  });
});
