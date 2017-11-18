const expect = require('expect');
const focalize = require('../src');

describe('Lens#andThen(lens)', () => {

  const childrenLens = focalize.prop('children')
  const arrayLens = focalize.identity

  const a = {
    children: [
      { name: 'one' },
      { name: 'two' }
    ]
  }
  const lens = childrenLens.andThen(arrayLens)
  const b = lens.push(a, { name: 'three' })

  it('can be combined with another lens to perform complex updates', () => {
    expect(b).toEqual({
      children: [
        { name: 'one' },
        { name: 'two' },
        { name: 'three' }
      ]
    })
  });
});
