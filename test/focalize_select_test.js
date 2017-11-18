const expect = require('expect');
const { select } = require('../src');

describe('focalize.select(predicate)', () => {

  const endsWith = value => name => new RegExp(value + '$').test(name)
  const contains = value => name => name.search(value) !== -1

  it('creates an array lens', () => {
    const array = [
      'Bob',
      'Fred',
      'Jeff',
      'Rob'
    ]
    const lens = select(endsWith('ob'));
    expect(lens.getAll(array)).toEqual([
      'Bob',
      'Rob'
    ])
  });

  it('sets the focused elements', () => {
    const array = [
      'Bob',
      'Fred',
      'Jeff',
      'Rob'
    ];
    const lens = select(endsWith('ob'));
    expect(lens.set(array, 'Biff')).toEqual([
      'Biff',
      'Fred',
      'Jeff',
      'Biff'
    ]);
  });

  it('modifies the focused elements', () => {
    const array = [
      'Bob',
      'Fred',
      'Jeff',
      'Rob'
    ];
    const lens = select(endsWith('ob'));
    expect(lens.mod(array, name => name + 'bity')).toEqual([
      'Bobbity',
      'Fred',
      'Jeff',
      'Robbity'
    ]);
  });

  const d = v => { console.log(v); return v };

  it('modifies all matching elements', () => {
    const array = [
      'Bob',
      'Fred',
      'Jeff'
    ];
    const lens = select(contains('e'));
    expect(lens.mod(array, name => name.replace('e', 'EE'))).toEqual([
      'Bob',
      'FrEEd',
      'JEEff'
    ]);
  });

});
