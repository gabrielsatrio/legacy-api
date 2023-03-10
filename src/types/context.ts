import { Request } from 'express';
import { Session, SessionData } from 'express-session';
import { createUserLoader } from '../utils/create-user-loader';

export interface Context {
  req: Request & {
    session: Session & Partial<SessionData> & { username: string };
  };
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
}
