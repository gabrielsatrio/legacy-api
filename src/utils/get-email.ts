import { User } from '../modules/core/entities/user';
import { mapError } from './map-error';

export const getEmail = async (
  email: string,
  employeeId?: string
): Promise<string> => {
  const allowedDomains = ['ateja.co.id', 'agtex.co.id'];
  let newEmail = email
    ? allowedDomains.includes(email.slice(email.indexOf('@') + 1) || '')
      ? email.toLowerCase()
      : 'oracle@ateja.co.id'
    : '';
  if (employeeId && newEmail === 'oracle@ateja.co.id') {
    try {
      const user = await User.findOneBy({ username: employeeId });
      if (user) {
        newEmail = user?.email;
      }
    } catch (err) {
      throw new Error(mapError(err));
    }
  }
  return newEmail;
};
