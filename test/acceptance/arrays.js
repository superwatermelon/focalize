import focalize from '../../src'
import expect from 'expect'

describe('Array usage', () => {
  describe('Array element lens', () => {

    const headElementLens = focalize.arrayElementLens(0)
    const secondElementLens = focalize.arrayElementLens(1)

    const a = [1, 2, 3]
    const b = headElementLens.set(a, 4)
    const c = []
    const d = headElementLens.set(c, 2)
    const e = secondElementLens.set(c, 3)
    const f = secondElementLens.set(a, 5)

    it('Updates the element at the position at which the lens is focused', () => {
      expect(b).toEqual([4, 2, 3])
      expect(f).toEqual([1, 5, 3])
    })

    it('Leaves the original array untouched', () => {
      expect(a).toEqual([1, 2, 3])
    })

    it('Adds elements to an empty array', () => {
      expect(d).toEqual([2])
      expect(e).toEqual([3]) // Is this correct or should it be [undefined, 3]?
    })

  })

  describe('Array lens', () => {

    const arrayLens = focalize.arrayLens()

    describe('Array push through a lens', () => {

      const a = [1, 2, 3]
      const b = arrayLens.push(a, 4)

      it('Appends an element to the end of an array', () => {
        expect(b).toEqual([1, 2, 3, 4])
      })

      it('Does not affect the source array', () => {
        expect(a).toEqual([1, 2, 3])
      })

    })

    describe('Array lenses composability', () => {

      const childrenLens = focalize.objectPropertyLens('children')
      const arrayLens = focalize.arrayLens()

      const a = {
        children: [
          { name: 'one' },
          { name: 'two' }
        ]
      }
      const lens = childrenLens.andThen(arrayLens)
      const b = lens.push(a, { name: 'three' })

      it('Can be combined with another lens to perform complex updates', () => {
        expect(b).toEqual({
          children: [
            { name: 'one' },
            { name: 'two' },
            { name: 'three' }
          ]
        })
      })

    })
  })
})
