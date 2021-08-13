import { Request, Response } from 'express';
import { createUserLoader } from '../utils/create-user-loader';

export interface Context {
  req: Request & { session: Express.Session };
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
}
