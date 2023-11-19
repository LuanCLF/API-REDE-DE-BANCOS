require('dotenv').config();

import server from './server/server';

const port = process.env.PORT_SERVER || 10000;

server.listen(port, () => console.log(`Running in localhost:${port}`));
