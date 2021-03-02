export const setErrors = (
  field: string,
  message: string
): Record<string, [{ field: string; message: string }]> => {
  return {
    errors: [{ field, message }]
  };
};
