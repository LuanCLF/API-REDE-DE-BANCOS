import { format } from 'date-fns';

export const dateFormat = (data: string): string => {
  data = format(+data, 'dd-MM-yyy HH:mm:ss');

  return data;
};
