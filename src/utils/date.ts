import * as dayjs from 'dayjs';

export const unixTime = (): number => Date.now() / 1000;

export const date = (unixTime: number): string => {
  return dayjs.unix(unixTime).format('YYYY-MM-DD HH:mm:ss');
};
