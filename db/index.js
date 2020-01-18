const pgp = require('pg-promise')();

const {
  DB_HOST: host,
  DB_PORT: port,
  DB_DATABASE: database,
  DB_USER: user,
  DB_PASSWORD: password,
} = process.env;

const cn = {
  host,
  port,
  database,
  user,
  password,
};

const db = pgp(cn);

module.exports = db;
