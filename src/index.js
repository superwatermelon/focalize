/**
 * @license
 * Focalize <https://superwatermelon.com/focalize>
 * Released under MIT license <https://superwatermelon.com/focalize/license>
 * Copyright Stuart Wakefield and Superwatermelon Limited
 */

/**
 * A Lens
 *
 * @private
 * @constructor
 * @param {Function} getter
 * @param {Function} setter
 * @see focalize.lens
 */
function Lens(getter, setter) {
  if (!(this instanceof Lens)) {
    return new Lens(getter, setter);
  }
  this.getter = getter;
  this.setter = setter;
}

/**
 * Gets the value from the target
 *
 * @memberOf Lens
 * @param {*} target the target
 * @returns {*} the value
 * @example
 *
 * const lens = focalize.prop('a');
 *
 * lens.get({ a: 1 });
 * // => 1
 */
Lens.prototype.get = function(target) {
  return Lens.get(this.getter, target);
};

/**
 * Sets the value on the target
 *
 * @memberOf Lens
 * @param {*} target the target
 * @param {*} value the value
 * @returns {*} the value
 * @example
 *
 * const lens = focalize.prop('a')
 *
 * lens.set({ a: 1 }, 2)
 * // => { a: 2 }
 */
Lens.prototype.set = function(target, value) {
  return Lens.set(this.getter, this.setter, target, value);
};

Lens.prototype.mod = function(target, fn) {
  return Lens.mod(this.getter, this.setter, target, fn);
};

Lens.prototype.push = function(target, ...source) {
  return Lens.push(this.getter, this.setter, target, ...source);
};

Lens.prototype.composeLens = function(other) {
  return Lens.compose(this, other);
};

/**
 * Composes the lens with a traversal and returns the resulting
 * traversal.
 *
 * @memberOf Lens
 * @param {Traversal} other the traversal
 * @returns {Traversal} the resulting traversal
 * @see Lens#scope(other)
 * @example
 *
 * const traversal = focalize.prop('name')
 *   .composeTraversal(
 *     focalize.select(user => user.promoted)
 *   );
 *
 * traversal.getAll([
 *   { name: 'Kathryn', promoted: false },
 *   { name: 'Jean-Luc', promoted: false },
 *   { name: 'James', promoted: true }
 * ]);
 * // => ['James']
 */
Lens.prototype.composeTraversal = function(other) {
  return Traversal.composeTraversal(Lens.asTraversal(this), other);
};

/**
 * Converts the lens into a traversal. You don't typically need
 * to call this method but is an important part of being able
 * to combine lenses with other traversals.
 *
 * @memberOf Lens
 * @returns {Traversal}
 * @see Lens#composeTraversal(other)
 * @example
 *
 * const traversal = focalize.prop('name').asTraversal();
 *
 * traversal.getAll({ name: 'Bob' })
 * // => ['Bob']
 */
Lens.prototype.asTraversal = function() {
  return Lens.asTraversal(this);
};

/**
 * Scopes the lens with another lens or traversable and returns
 * the resulting lens or traversal.
 *
 * @memberOf Lens
 * @alias andThen
 * @param {Lens|Traversal} other the traversal
 * @returns {Lens|Traversal} the resulting traversal
 * @example
 *
 * const lens = focalize.prop('a')
 *   .scope(focalize.prop('b'))
 *
 * traversal.get({ a: { b: 'c' } })
 * // => 'c'
 */
Lens.prototype.scope = function(other) {
  return other.composeLens(this)
};

Lens.get = function(getter, target) {
  return getter(target);
};

Lens.set = function(getter, setter, target, value) {
  if (getter(target) !== value) {
    return setter(target, value)
  }
  return target;
};

Lens.mod = function(getter, setter, target, fn) {
  return setter(target, fn(getter(target)));
};

Lens.push = function(getter, setter, target, ...source) {
  return Lens.mod(getter, setter, target, arr => arr.concat(source));
};

/**
 * Composes two lenses, where the first lens focuses
 * to a more specific part of the target object than
 * the second.
 *
 * @private
 * @param {Lens} a the first lens
 * @param {Lens} b the second lens
 * @returns {Lens} the resulting composed lens
 */
Lens.compose = function(a, b) {
  return new Lens(
    s => a.get(b.get(s)),
    (s, v) => b.mod(s, t => a.set(t, v))
  );
};

Lens.asTraversal = function(lens) {
  return new Traversal(
    (s, f) => lens.set(s, f(lens.get(s)))
  );
};

Lens.prototype.andThen = Lens.prototype.scope

function Traversal(modifier) {
  this.modifier = modifier;
}

Traversal.prototype.getAll = function(target) {
  return this.reduce(target, (acc, value) => acc.concat(value), []);
};

Traversal.prototype.reduce = function(target, fn, initial) {
  let result = initial;
  this.modifier(target, value => {
    result = fn(result, value);
    return value;
  });
  return result;
};

Traversal.prototype.set = function(target, value) {
  return Traversal.set(this.modifier, target, value);
};

Traversal.prototype.mod = function(target, fn) {
  return Traversal.mod(this.modifier, target, fn);
};

Traversal.prototype.composeLens = function(other) {
  return this.composeTraversal(other.asTraversal())
};

Traversal.prototype.composeTraversal = function(other) {
  return Traversal.composeTraversal(this, other);
};

Traversal.prototype.scope = function(other) {
  return other.composeTraversal(this)
};

Traversal.prototype.on = function(target) {
  return new AppliedTraversal(target,
    f => this.mod(target, f)
  );
};

Traversal.prototype.andThen = Traversal.prototype.scope;

Traversal.mod = function(modifier, target, fn) {
  return modifier(target, fn);
};

Traversal.set = function(modifier, target, value) {
  return modifier(target, () => value);
};

Traversal.composeTraversal = function(a, b) {
  return new Traversal(
    (s, f) => b.modifier(s, t => a.modifier(t, f))
  );
};

function lens(getter, setter) {
  return new Lens(getter, setter);
}

function traversal(modifier) {
  return new Traversal(modifier);
}

/**
 * Creates a traversal that applies to elements matching
 * the passed predicate.
 *
 * @static
 * @memberOf focalize
 * @param {Function} pred the predicate function
 * @returns {Traversal} a traversal
 */
function select(pred) {
  return traversal(
    (s, f) => map(s, it => pred(it) ? f(it) : it)
  );
}

function every() {
  return traversal(
    (s, f) => map(s, f)
  );
}

function prop(name) {
  return lens(
    s => s[name],
    (s, v) => assign(s, { [name]: v })
  );
}

function assign(obj, props) {
  return obj ? Object.assign({}, obj, props) : obj;
}

function map(target, fn) {
  return target && target.map ? target.map(fn) : target;
}

function path(...names) {
  return names.reduce((acc, name) =>
    prop(name).composeLens(acc), identity);
}

/**
 * Replaces the element in the array at the specified index.
 *
 * @private
 * @static
 * @param {Array} arr
 * @param {number} index
 * @param {*} value
 * @returns {Array}
 */
function replace(arr, index, value) {
  let result = arr.slice();
  result[index] = value;
  return result;
}

/**
 * Creates a lens over an array element
 *
 * @static
 * @memberOf focalize
 * @name element(index)
 * @param {number} index the index of the element to focus on
 * @return {Lens} a lens for the array element
 */
function element(index) {
  return lens(
    s => s[index],
    (s, v) => replace(s, index, v)
  );
}

function compose(...lenses) {
  return lenses.reduce((acc, lens) => lens.scope(acc), identity);
}

/**
 * Creates a lens for the first element of an array
 *
 * @static
 * @memberOf focalize
 * @name element.head
 * @alias element.first
 * @member {Lens}
 */
element.head = element.first = element(0);

/**
 * Creates a lens for the second element of an array
 *
 * @static
 * @memberOf focalize
 * @name element.second
 * @member {Lens}
 */
element.second = element(1);

/**
 * Creates a lens for the third element of an array
 *
 * @static
 * @memberOf focalize
 * @name element.third
 * @member {Lens}
 */
element.third = element(2);

/**
 * Creates a lens for the last element of an array
 *
 * @static
 * @memberOf focalize
 * @name element.last
 * @member {Lens}
 */
element.last = lens(
  s => s[s.length - 1],
  (s, v) => replace(s, s.length - 1, v)
);

const identity = lens(
  s => s,
  (s, v) => v
);

/**
 * @name focalize
 */
module.exports = {
  compose,
  element,
  every,
  identity,
  lens,
  path,
  prop,
  select,
  traversal
}
