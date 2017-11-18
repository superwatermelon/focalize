const expect = require('expect');
const focalize = require('../src');

describe('Advanced Usage', () => {
  describe('Lens for a custom class', () => {
    
    class MyArrayWrapper {
      constructor(elements = []) {
        this.elements = elements;
      }
    }

    const lens = focalize.lens(
      s => s.elements,
      (s, v) => new MyArrayWrapper(v)
    );

    const a = new MyArrayWrapper();
    const b = lens.push(a, 1);

    it('leaves the original instance untouched', () => {
      expect(a.elements).toEqual([]);
    });

    it('creates a new instance with the updated property', () => {
      expect(b.elements).toEqual([1]);
    });
  });

  describe('Lens for a custom class optimized', () => {

    class MyArrayWrapper {
      constructor(elements = []) {
        this.elements = elements;
      }
    }

    const lens = focalize.lens(
      s => s.elements,
      (s, v) => new MyArrayWrapper(v)
    ).scope(focalize.element.head);

    const a = new MyArrayWrapper();
    const b = lens.set(a, 1);
    const c = lens.set(b, 1);

    it('applies changes economically', () => {
      expect(a).not.toBe(b);
      expect(b).toBe(c);
    });
  });
});
