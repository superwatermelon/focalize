import focalize from '../src'
import expect from 'expect'

describe('focalize.objectPropertyLens(name)', () => {
  it('Creates a lens for a generic object literal property', () => {

    const lens = focalize.objectPropertyLens('name')
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
