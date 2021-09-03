import { MiddlewareFn } from 'type-graphql';
import { Context } from 'vm';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.username) {
    throw new Error('Not authenticated.');
  }
  return next();
};
