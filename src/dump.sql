-- Active: 1694651585786@@127.0.0.1@5432@banco@public
CREATE TABLE banks (
id SERIAL PRIMARY KEY,
number VARCHAR(200) UNIQUE NOT NULL,
agency VARCHAR(200) UNIQUE NOT NULL,
password VARCHAR(200) NOT NULL,
name VARCHAR(200) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL,
CPF VARCHAR(200) NOT NULL,
dateOfBirth VARCHAR(200) NOT NULL,
phoneNumber VARCHAR(200),
email VARCHAR(200) NOT NULL,
password VARCHAR(200) NOT NULL,
)

CREATE TABLE accounts (
number SERIAL PRIMARY KEY,
bank_id INTEGER REFERENCES banks(id),
balance INTEGER NOT NULL,
user_id INTEGER REFERENCES users(id),
created_at TIMESTAMP NOT NULl DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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

