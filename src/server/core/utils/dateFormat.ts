import { format } from 'date-fns';

export const dateFormat = (data: Date): string => {
  const result = format(+data, 'dd-MM-yyyy HH:mm:ss');

  return result;
};
