export const field = (field: string, nameField: string) => {
  if (!field || field === 'undefined' || field.trim() === '') {
    return true;
  } else if (
    (nameField === 'number' || nameField === 'agency') &&
    isNaN(Number(field))
  ) {
    return true;
  }
  return false;
};
