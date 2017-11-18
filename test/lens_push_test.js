const expect = require('expect');
const focalize = require('../src');

describe('Lens#push(target, ...elements)', () => {

  const arrayLens = focalize.identity;
  const a = [1, 2, 3];
  const b = arrayLens.push(a, 4);

  it('appends an element to the end of an array', () => {
    expect(b).toEqual([1, 2, 3, 4]);
  });

  it('does not affect the source array', () => {
    expect(a).toEqual([1, 2, 3]);
  });
});
