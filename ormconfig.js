/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');

module.exports = {
  type: 'oracle',
  host: process.env.DATABASE_HOST,
  port:
    typeof process.env.DATABASE_PORT === 'number' ? +process.env.PORT : 1521,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  sid: process.env.DATABASE_SID,
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
  entities: [join(__dirname, 'src/entities/**/!(*.test).{ts,js}')],
  migrations: [join(__dirname, 'src/db/migrations/**/!(*.test).{ts,js}')],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/db/migrations'
  }
};
