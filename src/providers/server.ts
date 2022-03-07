import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import chalk from 'chalk';
import compression from 'compression';
import connectRedis from 'connect-redis';
import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import http from 'http';
import https from 'https';
import { join } from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import config from '../config/main';
import { createUserLoader } from '../utils/create-user-loader';
import { getReport } from '../utils/get-report';
import { redis } from './redis';

const isProd = config.env === 'production';
const isTest = config.env === 'test';
let server: http.Server | https.Server;

export default class apolloServer {
  static initialize = async (): Promise<void> => {
    const app = express();
    const RedisStore = connectRedis(session);

    app.set('trust proxy', 1);
    app.use(
      cors({
        credentials: true,
        origin: config.client.url
      })
    );
    app.use(express.json());
    app.use(
      helmet({
        contentSecurityPolicy: isProd || isTest ? undefined : false
      })
    );
    app.use(
      session({
        store: new RedisStore({
          client: redis,
          disableTouch: true
        }),
        name: config.cookie.name,
        secret: config.session.secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: isProd || isTest,
          sameSite: 'lax', // csrf
          domain: isProd || isTest ? config.cookie.domain : undefined,
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 years
        }
      } as any)
    );
    app.use(compression());
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    app.get('/api/report', async (req, res) => {
      try {
        const { path, format, params } = req.query;
        const reportFormat = format || 'pdf';
        let mimeType = 'application/pdf';
        switch (reportFormat) {
          case 'xlsx':
            mimeType =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
          default:
            'application/pdf';
        }
        const reportUrl = `${
          config.jrs.url
        }/rest_v2/reports/reports/${path}.${reportFormat}?${
          typeof params === 'string' &&
          params.replace(/;/g, '&').replace(/%/g, '%25')
        }`;
        const reportId = crypto.randomBytes(16).toString('hex');
        const filePath = `./tmp/${reportId}.${reportFormat}`;
        await getReport(
          reportUrl,
          config.jrs.username,
          config.jrs.password,
          filePath
        );
        if (fs.existsSync(filePath)) {
          res.contentType(mimeType);
          const file = fs.createReadStream(filePath);
          file.on('end', () => {
            fs.unlinkSync(filePath);
          });
          file.pipe(res);
        } else {
          res.status(500);
          res.send('File not found');
        }
      } catch (err) {
        console.error('>> JRS_ERROR: ', err);
      }
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [join(__dirname, '../modules/**/!(*.d).rv.{ts,js}')],
        authChecker: ({ context: { req } }) => !!req.session.username,
        validate: true
      }),
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
      context: ({ req, res }) => ({
        req,
        res,
        userLoader: createUserLoader()
      }),
      introspection: !isProd && !isTest
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(config.api.port, () =>
      console.log(
        chalk.red.bold('🚀 '),
        chalk.green.bold('Server ready at'),
        chalk.yellow.bold(
          `http${isProd || isTest ? 's' : ''}://${config.api.hostname}${
            !isProd && !isTest ? `:${config.api.port}` : ''
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
