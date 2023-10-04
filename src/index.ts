require('dotenv').config();

import { allRoutes } from './server/server';

const port = process.env.PORT_SERVER || 10000;

allRoutes.listen(port, () => console.log(`Running in localhost:${port}`));
