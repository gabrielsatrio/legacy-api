import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export const setErrors = (
  message: string,
  field?: string
): Record<
  string,
  boolean | [{ message: string; field: string | null; code: string | null }]
> => {
  let code = null;
  let errorMessage = message;
  if (message.substr(0, 4) === 'ORA-') {
    code = message.substr(0, 9);
    errorMessage = capitalizeFirstLetter(
      message.indexOf('\n') > 0
        ? message.substring(11, message.indexOf('\n'))
        : message.substr(11, message.length)
    );
  }
  return {
    success: false,
    errors: [{ message: errorMessage, field: field || null, code }]
  };
};
