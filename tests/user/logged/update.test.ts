import { routesServer } from '../../jest.setup';

describe('update user', () => {
  let token = '';
  beforeAll(async () => {
    const response = await routesServer.post('/user/login').send({
      number: '1234',
      agency: '1234',
      cpf: '02302302332',
      password: 'senha',
    });

    token = response.body.token;
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
});
