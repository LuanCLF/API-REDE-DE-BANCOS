import { routesServer } from '../jest.setup';

describe('search my bank', () => {
  it('tried to search my bank but failed because Im unauthorized', async () => {
    const login = await routesServer.get('/bank').send();

    expect(login.statusCode).toEqual(401);
  });
});
