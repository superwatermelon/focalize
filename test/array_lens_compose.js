import focalize from '../src'
import expect from 'expect'

describe('ArrayLens#compose', () => {
  it('Returns an ArrayLens', () => {

    class Outer {
      constructor(items) {
        this.items = items
      }
    }
    const itemsArrayLens = focalize.arrayLens()
    const outerItemsLens = focalize.lens(
      s => s.items,
      (s, v) => new Outer(v)
    )
    const outerItemsArrayLens = itemsArrayLens.compose(outerItemsLens)
    const a = new Outer([])
    const b = outerItemsArrayLens.push(a, 1)

    expect(b.items).toEqual([1])

  })
})
