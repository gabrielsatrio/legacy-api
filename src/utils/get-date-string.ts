const pad = (value: any) => {
  return value < 10 ? '0' + value : value;
};

export const getDateString = (datetime: Date): string => {
  const year = datetime.getFullYear();
  const month = pad(datetime.getMonth() + 1);
  const day = pad(datetime.getDate());
  const hour = pad(datetime.getHours());
  const min = pad(datetime.getMinutes());
  const sec = pad(datetime.getSeconds());
  return year + month + day + hour + min + sec;
};
