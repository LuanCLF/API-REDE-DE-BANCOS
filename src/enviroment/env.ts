import { Pool } from 'pg';
import { config } from 'dotenv';

config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const passwordUserJWT = String(process.env.PASSWORD_USER_JWT);
export const passwordBankJWT = String(process.env.PASSWORD_BANK_JWT);
export const portBank = Number(process.env.PORT_USER_SERVER);
export const portUser = Number(process.env.PORT_BANK_SERVER);