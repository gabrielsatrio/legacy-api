import dotenvFlow from 'dotenv-flow';

const envFound = dotenvFlow.config();

if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  api: {
    hostname: process.env.API_HOSTNAME || 'localhost',
    port: process.env.API_PORT || 4000
  },
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
        : 3306,
    database: 'legacy',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    logging: process.env.DATABASE_LOGGING === 'true' ? true : false
  },
  deploy: process.env.DEPLOY === 'true' ? true : false,
  env: process.env.NODE_ENV || 'development',
  jrs: {
    url: process.env.JRS_URL,
    username: process.env.JRS_USERNAME,
    password: process.env.JRS_PASSWORD
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || (25 as any),
    sender: process.env.MAIL_SENDER
  },
  session: {
    secret: process.env.SESSION_SECRET
  },
  token: {
    prefix: process.env.FORGET_PASSWORD_PREFIX
  }
};
