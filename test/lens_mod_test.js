const focalize = require('../src')
const expect = require('expect')

describe('Lens#mod(s, a => b)', () => {
  it('modifies the value targeted by the lens', () => {

    class Sample {
      constructor(prop) {
        this.prop = prop
      }
    }

    const lens = focalize.lens(
      (s) => s.prop,
      (s, v) => new Sample(v)
    )

    const a = new Sample('lowercase')
    const b = lens.mod(a, v => ('upper' + v.substr(5)).toUpperCase())
    expect(b.prop).toBe('UPPERCASE')

  })
})
