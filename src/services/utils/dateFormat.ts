import { format } from 'date-fns';

export const dateFormat = (): string => {
  const data = format(new Date(), 'dd-MM-yyy HH:mm:ss');

  return data;
};
