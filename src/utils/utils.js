
export const toNumber = (string) =>
  parseInt(string.split(',').join(''), 10) || 0;
