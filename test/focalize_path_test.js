const expect = require('expect');
const focalize = require('../src');

describe('focalize.path(...names)', () => {

  const lens = focalize.path('a', 'b', 'c');
  const a = { a: { b: { c: 1 } } };

  it('focuses the lens on the item at the specified path', () => {
    expect(lens.get(a)).toBe(1);
    expect(lens.set(a, 2)).toEqual({ a: { b: { c: 2 } } });
  });

});
