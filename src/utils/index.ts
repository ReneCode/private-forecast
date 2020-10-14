export const getDate = (dayDelta: number = 0) => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000 * dayDelta);
};

export const dateToDateId = (dt: Date): string => {
  return `${dt.getUTCFullYear()}-${dt.getUTCMonth() + 1}-${dt.getUTCDate()}`;
};
