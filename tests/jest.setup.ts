import supertest from 'supertest';

import { allRoutes } from '../src/server/server';

export const routesServer = supertest(allRoutes);
