import dotenvFlow from 'dotenv-flow';

const envFound = dotenvFlow.config();

if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  client: {
    url: process.env.FRONTEND_URL
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN,
    name: process.env.COOKIE_NAME
  },
  db: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port:
      process.env.DATABASE_PORT === 'number'
        ? +process.env.DATABASE_PORT
        : 1521,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    sid: process.env.DATABASE_SID,
    logging: process.env.DATABASE_LOGGING === 'true' ? true : false
  },
  env: process.env.NODE_ENV || 'development',
  redis: {
    url: process.env.REDIS_URL
  },
  server: {
    port: process.env.PORT || 4000
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  token: {
    prefix: process.env.FORGET_PASSWORD_PREFIX
  }
};
