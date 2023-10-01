import { routesServer } from '../jest.setup';

describe('get all banks', () => {
  it('get all banks', async () => {
    const banks = await routesServer.get('/banks');

    expect(banks.statusCode).toEqual(200);
  });
});
