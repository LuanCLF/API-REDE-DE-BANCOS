import { format } from 'date-fns';

export const dateFormat = (data: string): string => {
  const timestampUtc = +data;
  const dataBrazilTimestamp = timestampUtc - 3 * 3600000;
  data = format(dataBrazilTimestamp, 'dd-MM-yyy HH:mm:ss');

  return data;
};
