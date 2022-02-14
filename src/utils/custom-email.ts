export const customEmail = (email: string): string => {
  const allowedDomains = ['ateja.co.id', 'agtex.co.id'];
  return email
    ? allowedDomains.includes(email.slice(email.indexOf('@') + 1) || '')
      ? email.toLowerCase()
      : 'oracle@ateja.co.id'
    : '';
};
