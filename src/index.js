class Lens {
    constructor(get, set) {
        this.get = get
        this.set = set
    }
    
    mod(s, f) {
        return this.set(s, f(this.get(s)))
    }
}

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
        (s) => s[name],
        (s, v) => Object.assign({}, s, object([name], [v]))
    )
}

export { lens, objectPropertyLens }
export default { lens, objectPropertyLens }