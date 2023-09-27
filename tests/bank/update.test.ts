import { routesServer } from '../jest.setup';

describe('update bank', () => {
  it('tried to update my data but failed because Im unauthorized', async () => {
    const login = await routesServer.get('/bank').send();

    expect(login.statusCode).toEqual(401);
  });
});
