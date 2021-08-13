import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import chalk from 'chalk';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import { join } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import config from '../config/main';
import { createUserLoader } from '../utils/create-user-loader';
import { redis } from './redis';

const isProd = config.env === 'production';
let server: http.Server | https.Server;

export default class apolloServer {
  static initialize = async (): Promise<void> => {
    const app = express();

    const RedisStore = connectRedis(session);

    app.use(express.json());

    app.use(
      helmet({
        // TODO: fix it!
        // contentSecurityPolicy: isProd ? undefined : false
        contentSecurityPolicy: false
      })
    );

    app.use(
      cors({
        credentials: true,
        origin: config.client.url
      })
    );

    app.set('trust proxy', 1);

    app.use(
      session({
        store: new RedisStore({
          client: redis,
          disableTTL: true,
          disableTouch: true
        }),
        name: config.cookie.name,
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false, // use "isProd" as value, so that cookie can works for https only
          sameSite: 'lax', // csrf
          domain: isProd ? config.cookie.domain : undefined,
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 years
        }
      } as any)
    );

    app.use(compression());

    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [join(__dirname, '../modules/**/!(*.d).rv.{ts,js}')],
        authChecker: ({ context: { req } }) => !!req.session.userId,
        validate: true
      }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
      context: ({ req, res }) => ({
        req,
        res,
        userLoader: createUserLoader()
      }),
      introspection: !isProd
      // uploads: false // disable apollo upload property
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    server = http.createServer(app);

    // Add subscription support
    // apolloServer.installSubscriptionHandlers(server);

    server.listen(config.server.port, () =>
      console.log(
        chalk.red.bold('🚀 '),
        chalk.green.bold('Server ready at'),
        chalk.yellow.bold(
          `http://${isProd ? 'api.ateja.co.id' : 'localhost'}:${
            config.server.port
          }${apolloServer.graphqlPath}`
        )
      )
    );
  };

  static close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      server.close((err: Error | null | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };
}
