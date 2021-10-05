/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { capitalizeFirstLetter } from './capitalize-first-letter';

export const mapError = (error: any): string => {
  let code = null;
  let errorMessage = error.message;
  if (errorMessage.substr(0, 4) === 'ORA-') {
    code = errorMessage.substr(0, 9);
    switch (code) {
      case 'ORA-00001':
        errorMessage = 'Data already exists.';
        break;
      case 'ORA-02292':
        errorMessage = 'Cannot delete parent record referenced by another data';
        break;
      default:
        errorMessage = capitalizeFirstLetter(
          errorMessage.indexOf('\n') > 0
            ? errorMessage.substring(11, errorMessage.indexOf('\n'))
            : errorMessage.substr(11, errorMessage.length)
        );
    }
  }
  return errorMessage;
};
