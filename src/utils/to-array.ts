export const toArray = (text: string, separator = ';'): string[] | number[] =>
  text.split(separator);
