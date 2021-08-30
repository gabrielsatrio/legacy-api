import { capitalizeFirstLetter } from './capitalize-first-letter';

export const mapError = (message: string): string => {
  let code = null;
  let errorMessage = message;
  if (message.substr(0, 4) === 'ORA-') {
    code = message.substr(0, 9);
    switch (code) {
      case 'ORA-00001':
        errorMessage = 'Data already exists.';
        break;
      default:
        errorMessage = capitalizeFirstLetter(
          message.indexOf('\n') > 0
            ? message.substring(11, message.indexOf('\n'))
            : message.substr(11, message.length)
        );
    }
  }
  return errorMessage;
};
