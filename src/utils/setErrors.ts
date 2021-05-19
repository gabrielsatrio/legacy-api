import { capitalizeFirstLetter } from './capitalizeFirstLetter';

export const setErrors = (
  message: string,
  field?: string
): Record<
  string,
  [{ message: string; field: string | null; code: string | null }]
> => {
  let code = null;
  let errorMessage = message;
  if (message.substr(0, 4) === 'ORA-') {
    code = message.substr(0, 9);
    errorMessage = capitalizeFirstLetter(
      message.substring(11, message.indexOf('\n'))
    );
  }
  return {
    errors: [{ message: errorMessage, field: field || null, code }]
  };
};
