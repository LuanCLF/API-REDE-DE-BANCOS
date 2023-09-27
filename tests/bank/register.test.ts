import { routesServer } from '../jest.setup';

describe('register an account', () => {
  it('Attempted to create a register but failed because the data was not sent correctly', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({ nome: 'luan' });

    expect(banco.statusCode).toEqual(400);
  });

  it('Tried to create a register but failed because the bank already exists', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '123',
        agency: '123',
        password: 'senha',
        zipcode: '59800000',
      });

    expect(banco.statusCode).toEqual(409);
  });

  it('Attempted to create a register but failed because the agency number is not numeric', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '123',
        agency: '123a',
        password: 'senha',
        zipcode: '59800000',
      });

    expect(banco.statusCode).toEqual(400);
  });
  it('Tried to create a register but failed because the bank number is not numeric', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '123a',
        agency: '123',
        password: 'senha',
        zipcode: '59800000',
      });

    expect(banco.statusCode).toEqual(400);
  });
  it('Attempted to create a register but failed because the minimum number of characters was not met', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({
        name: 'it',
        number: '12',
        agency: '123',
        password: 'senha',
        zipcode: '59800000',
      });

    expect(banco.statusCode).toEqual(400);
  });

  it('Tried to create a register but failed because the zipcode is invalid', async () => {
    const banco = await routesServer
      .post('/bank')
      .set('Content-Type', 'application/json')
      .send({
        name: 'itau',
        number: '040404040404040404040404',
        agency: '12040404040404040404043',
        password: 'senha',
        zipcode: '59800001',
      });

    expect(banco.statusCode).toEqual(404);
  });
});
