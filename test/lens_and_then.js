import focalize from '../src'
import expect from 'expect'

describe('Lens#andThen(other)', () => {
  it('Performs a compose in reverse', () => {

    class Outer {
      constructor(inner) {
        this.inner = inner
      }
    }
    class Inner {
      constructor(value) {
        this.value = value
      }
    }

    const innerValueLens = focalize.lens(
      s => s.value,
      (s, v) => new Inner(v)
    )
    const outerInnerLens = focalize.lens(
      s => s.inner,
      (s, v) => new Outer(v)
    )
    const outerInnerValueLens = outerInnerLens.andThen(innerValueLens)
    const a = new Outer(new Inner(123))
    const b = outerInnerValueLens.set(a, 234)

    expect(b.inner.value).toEqual(234)
  })
})
