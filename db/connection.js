// const { Pool } = require('pg');

// const ENV = process.env.NODE_ENV || 'development';

// const config = {};

// require('dotenv').config({
//   path: `${__dirname}/../.env.${ENV}`,
// });

// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error('PGDATABASE or DATABASE_URL not set');
// }

// if (ENV === 'production') {
//   config.connectionString = process.env.DATABASE_URL;
//   config.max = 2

// }


const { Pool } = require('pg');


const ENV =
  process.env.NODE_ENV === 'test' ||
  process.env.JEST_WORKER_ID !== undefined
    ? 'test'
    : process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config = {};

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
  config.ssl = { rejectUnauthorized: false };
} else {
  config.database = process.env.PGDATABASE;
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.host = process.env.PGHOST;
  config.port = process.env.PGPORT;
}

const db = new Pool(config);

module.exports = db;