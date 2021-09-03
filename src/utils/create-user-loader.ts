import DataLoader from 'dataloader';
import { User } from '../modules/core/entities/user';

export const createUserLoader = (): DataLoader<string, User> =>
  new DataLoader(async (usernames) => {
    const users = await User.findByIds(usernames as string[]);
    const userMap: Record<string, User> = {};
    users.forEach((user: User) => {
      userMap[user.username] = user;
    });
    return usernames.map((username) => userMap[username]);
  });
