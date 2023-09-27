import { allRoutes } from './server/server';

const port = process.env.PORT_USER_SERVER || 10000;

allRoutes.listen(port);
