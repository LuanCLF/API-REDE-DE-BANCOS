-- Active: 1694651585786@@127.0.0.1@5432@banco@public
CREATE TABLE banks (
id SERIAL PRIMARY KEY,
number TEXT NOT NULL,
agency TEXT NOT NULL,
password TEXT NOT NULL
)

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
CPF TEXT NOT NULL,
dateOfBirth DATE NOT NULL,
phoneNumber TEXT,
email TEXT NOT NULL,
password TEXT NOT NULL
)

CREATE TABLE accounts (
number SERIAL PRIMARY KEY,
bank_id INTEGER REFERENCES banks(id),
balance INTEGER NOT NULL,
user_id INTEGER REFERENCES users(id)
)

CREATE TABLE deposit (
id SERIAL PRIMARY KEY,
date TIMESTAMP NOT NULL,
account_id INTEGER REFERENCES accounts(number),
value BIGINT NOT NULL
)

CREATE TABLE withdrawal (
id SERIAL PRIMARY KEY,
date TIMESTAMP NOT NULL,
account_id INTEGER REFERENCES accounts(number),
value BIGINT NOT NULL
)

CREATE TABLE transfers (
id SERIAL PRIMARY KEY,
date TIMESTAMP NOT NULL,
account_origin_id INTEGER REFERENCES accounts(number),
account_destiny_id INTEGER REFERENCES accounts(number),
value BIGINT NOT NULL
)

