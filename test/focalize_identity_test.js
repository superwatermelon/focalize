const expect = require('expect');
const focalize = require('../src');

describe('focalize.identity', () => {

  const lens = focalize.identity;
  const a = 1;

  it('provides the most simplistic lense an identity lense', () => {
    expect(lens.get(a)).toBe(1)
    expect(lens.set(a, 2)).toBe(2)
  })
});
