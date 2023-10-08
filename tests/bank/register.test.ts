import { routesServer } from '../jest.setup';

describe('register a bank', () => {
  afterAll(async () => {
    let token = '';
    const response = await routesServer.post('/bank/login').send({
      number: '04040404',
      agency: '04040404',
      password: 'senha',
    });

    token = response.body.token;
    await routesServer
      .delete('/bank')
      .set({ authorization: `Bearer ${token}` })
      .send({ password: 'senha' });
  });

  it('attempted to create a register but failed because the data was not sent correctly', async () => {
    const banco = await routesServer.post('/bank').send({ nome: 'luan' });

    expect(banco.statusCode).toEqual(400);
  });

  it('tried to create a register but failed because the bank already exists', async () => {
    const banco = await routesServer.post('/bank').send({
      name: 'itauunibanco',
      number: '1234',
      agency: '1234',
      password: 'senha',
      zipcode: '59800000',
    });

    expect(banco.statusCode).toEqual(409);
  });

  it('attempted to create a register but failed because the agency number is not numeric', async () => {
    const banco = await routesServer.post('/bank').send({
      name: 'itauunibanco',
      number: '1234',
      agency: '123a',
      password: 'senha',
      zipcode: '59800000',
    });

    expect(banco.statusCode).toEqual(400);
  });
  it('tried to create a register but failed because the bank number is not numeric', async () => {
    const banco = await routesServer.post('/bank').send({
      name: 'itauunibanco',
      number: '123a',
      agency: '1234',
      password: 'senha',
      zipcode: '59800000',
    });

    expect(banco.statusCode).toEqual(400);
  });
  it('attempted to create a register but failed because the minimum number of characters was not met', async () => {
    const banco = await routesServer.post('/bank').send({
      name: 'it',
      number: '12',
      agency: '123',
      password: 'senha',
      zipcode: '59800000',
    });

    expect(banco.statusCode).toEqual(400);
  });

  it('tried to create a register but failed because the zipcode is invalid', async () => {
    const banco = await routesServer.post('/bank').send({
      name: 'itauunibanco',
      number: '040404040404040404040404',
      agency: '12040404040404040404043',
      password: 'senha',
      zipcode: '59800001',
    });

    expect(banco.statusCode).toEqual(404);
  });

  it('tried to create a register and succeeded', async () => {
    const bank = await routesServer.post('/bank').send({
      name: 'anedeguemon',
      number: '04040404',
      agency: '04040404',
      password: 'senha',
      zipcode: '59800000',
    });

    expect(bank.statusCode).toEqual(201);
  });
});
