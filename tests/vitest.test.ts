import { expect, it } from 'vitest';

function reverseString(str) {
  return str.split('').reverse().join('');
}

it('reverses a string', () => {
  const string = reverseString('abcde');
  expect(string).toBe('edcba');
});
it('throws an error if given an invalid input', () => {
  expect(() => reverseString(1)).toThrow();
});
