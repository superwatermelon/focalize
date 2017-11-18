const expect = require('expect');
const focalize = require('../src');

describe('Lens#asTraversal()', () => {
  const lens = focalize.prop('name');
  const traversal = lens.asTraversal();

  it('converts the lens into a traversal', () => {
    expect(lens.get({ name: 'Bob' })).toBe('Bob');
    expect(traversal.getAll({ name: 'Bob' })).toEqual(['Bob']);
  });

  it('sets the value as normal', () => {
    expect(traversal.set({ name: 'Bob' }, 'Fred')).toEqual({ name: 'Fred' });
  });

  it('modifies the value as normal', () => {
    expect(traversal.mod({ name: 'Bob' }, name => name + 'bo')).toEqual({ name: 'Bobbo' });
  });
});
