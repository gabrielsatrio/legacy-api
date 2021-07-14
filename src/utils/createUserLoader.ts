import DataLoader from 'dataloader';
import { User } from '../features/core/entities/User';

export const createUserLoader = (): DataLoader<string, User> =>
  new DataLoader(async (userIds) => {
    const users = await User.findByIds(userIds as string[]);
    const userMap: Record<string, User> = {};
    users.forEach((user: User) => {
      userMap[user.id] = user;
    });
    return userIds.map((userId) => userMap[userId]);
  });
