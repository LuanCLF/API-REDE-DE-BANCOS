const field = (field: string, nameField: string) => {
  if (field === 'undefined' || field.trim() === '') {
    return false;
  } else if (
    (nameField === 'number' || nameField === 'agency') &&
    isNaN(Number(field))
  ) {
    return false;
  }
  return true;
};

export const callValidate = (obj: object) => {
  const keys = Object.keys(obj),
    values = Object.values(obj);

  const invalid = keys.every((key, index) => {
    return field(values[index], key);
  });
  return invalid;
};
