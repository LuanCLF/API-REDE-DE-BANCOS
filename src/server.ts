import express from 'express';
import { routes } from './router/router';

const app = express();
app.use(express.json());
app.use(routes);

app.listen(3000);
