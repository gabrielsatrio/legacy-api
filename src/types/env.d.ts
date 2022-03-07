declare namespace NodeJS {
  interface ProcessEnv {
    API_HOSTNAME: string;
    API_PORT: string;
    DATABASE_TYPE: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_SID: string;
    DATABASE_LOGGING: string;
    REDIS_URL: string;
    FRONTEND_URL: string;
    COOKIE_NAME: string;
    COOKIE_DOMAIN: string;
    SESSION_SECRET: string;
    FORGET_PASSWORD_PREFIX: string;
    JRS_URL: string;
    JRS_USERNAME: string;
    JRS_PASSWORD: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_SENDER: string;
  }
}
