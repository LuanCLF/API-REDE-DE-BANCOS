import { routesServer } from '../jest.setup';

describe('delete my bank', () => {
  it('tried to delete my bank but failed because Im unauthorized', async () => {
    const login = await routesServer.delete('/bank').send();

    expect(login.statusCode).toEqual(401);
  });
});
