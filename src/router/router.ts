import express from 'express';
import { pool } from '../conection/conectDb';

const routes = express();

routes.get('/', async (req, res) => {
  const ban = await pool.query('select * from banks');
  console.log(ban.rows);

  res.send('adsdsad');
});

export { routes };
