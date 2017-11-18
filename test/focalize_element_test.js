const expect = require('expect');
const focalize = require('../src');

describe('focalize.element(index)', () => {

  const first = focalize.element(0);
  const second = focalize.element(1);
  const third = focalize.element(2);

  const arr = [1, 2, 3];

  it('updates the element at the position at which the lens is focused', () => {
    expect(first.set(arr, 0)).toEqual([0, 2, 3]);
    expect(second.set(arr, 0)).toEqual([1, 0, 3]);
    expect(third.set(arr, 0)).toEqual([1, 2, 0]);
  });

  it('leaves the original array untouched', () => {
    expect(arr).toEqual([1, 2, 3]);
  });

  it('inserts elements into to an empty array', () => {
    expect(first.set([], 1)).toEqual([1]);
    expect(second.set([], 2)).toEqual([undefined, 2]);
    expect(third.set([], 3)).toEqual([undefined, undefined, 3]);
  });
});
