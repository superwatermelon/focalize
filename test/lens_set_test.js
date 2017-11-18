const focalize = require('../src')
const expect = require('expect')

describe('Lens#set(s, v)', () => {
  it('updates the value targeted by the lens', () => {

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

  it('makes changes economically by default', () => {

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
    const b = lens.set(a, 'before')
    expect(a).toBe(b)

  });
})
