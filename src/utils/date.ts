import * as dayjs from 'dayjs';

export const unixTime: number = new Date().getTime() / 1000;

export const date = (unixTime: number): string => {
  return dayjs.unix(unixTime).format('YYYY-MM-DD HH:mm:ss');
};
