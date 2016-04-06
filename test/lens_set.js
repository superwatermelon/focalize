import focalize from '../src'
import expect from 'expect'

describe('Lens#set(s, v)', () => {
  it('Updates the value targeted by the lens', () => {

    class Sample {
      constructor(prop) {
        this.prop = prop
      }
    }

    const lens = focalize.lens(
      (s) => s.prop,
      (s, v) => new Sample(v)
    )

    const a = new Sample('before')
    const b = lens.set(a, 'after')
    expect(b.prop).toBe('after')
    
  })
})
