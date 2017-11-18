const focalize = require('../src')
const expect = require('expect')

describe('focalize.prop(name)', () => {
  it('creates a lens for a generic object literal property', () => {

    const lens = focalize.prop('name')
    const a = {
      name: 'Barney',
      age: 20
    }
    const b = lens.set(a, 'Geoffrey')

    expect(a).toEqual({
      name: 'Barney',
      age: 20
    })

    expect(b).toEqual({
      name: 'Geoffrey',
      age: 20
    })

  })
})
