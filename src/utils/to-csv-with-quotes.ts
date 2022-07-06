export const toCsvWithQuotes = (value: string[]): string =>
  "'" + value.join("', '") + "'";
