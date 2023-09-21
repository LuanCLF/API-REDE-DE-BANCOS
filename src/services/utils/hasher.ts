import { hash } from 'bcrypt';

export const hasher = async (password: string): Promise<string> => {
  const passwordHashed = hash(password, 10);
  return passwordHashed;
};
