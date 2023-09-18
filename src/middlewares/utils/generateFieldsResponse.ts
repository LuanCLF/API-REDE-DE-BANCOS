export const fieldsResponse = (arr: string[]): string => {
  let str = '';

  arr.filter((item, index) => {
    if (str.length < 1) {
      str += item;
    } else if (index === arr.length - 1) {
      str += ` e ${item}`;
    } else {
      str += `, ${item}`;
    }
  });

  return `Tenha certeza que preencheu os campos de ${str} corretamente`;
};
