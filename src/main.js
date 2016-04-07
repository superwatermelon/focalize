class Lens {
  constructor(get, set) {
    this.get = get
    this.set = set
  }

  mod(s, f) {
    return this.set(s, f(this.get(s)))
  }

  compose(other) {
    return Lens.compose(this, other)
  }

  andThen(other) {
    return other.compose(this)
  }
}

Lens.compose = (a, b) => new Lens(
  s => a.get(b.get(s)),
  (s, v) => b.mod(s, t => a.set(t, v))
)

function lens(get, set) {
  return new Lens(get, set)
}

function object(k, v) {
  var r = {}
  for (let i = 0 ; i < k.length ; ++i)
    r[k[i]] = v[i]
  return r
}

function objectPropertyLens(name) {
  return lens(
    s => s[name],
    (s, v) => Object.assign({}, s, object([name], [v]))
  )
}

function arrayElementLens(index) {
  return lens(
    s => s[index],
    (s, v) => s.slice(0, index).concat([v]).concat(s.slice(index + 1))
  )
}

class ArrayLens extends Lens {
  constructor(get, set) {
    super(get, set)
  }

  push(s, e) {
    return this.mod(s, v => v.concat([e]))
  }

  compose(other) {
    return ArrayLens.compose(this, other)
  }
}

function d(label, v) {
  console.log(label, v)
  return v
}

ArrayLens.compose = (a, b) => new ArrayLens(
  s => a.get(b.get(s)),
  (s, v) => b.mod(s, t => a.set(t, v))
)

function arrayLens() {
  return new ArrayLens(
    s => s,
    (s, v) => v
  )
}

export {
  lens,
  objectPropertyLens,
  arrayElementLens,
  arrayLens
}
