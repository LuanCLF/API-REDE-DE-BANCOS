import { compare, hash } from 'bcrypt';

export const hasher = async (password: string): Promise<string> => {
  const passwordHashed = hash(password, 10);
  return passwordHashed;
};

export const compareHashed = async (
  password: string,
  passwordHashed: string
): Promise<boolean> => {
  const correct = await compare(password, passwordHashed);
  return correct;
};
