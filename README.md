# Focalize

A functional lens framework. **WIP**.

We want to be able to do something powerful such as update with
immutability items within an array that match a predicate

```js
const data = {
  fruit: [
    {
      name: 'Apple',
      taste: 'Sweet'
    },
    {
      name: 'Pear',
      taste: 'Sweet'
    },
    {
      name: 'Lemon',
      taste: 'Sour'
    }
  ]
}

const fruitLens = focalize.prop('fruit')
const sweetFruitLens = focalize.predicateArrayLens(item => item.taste === 'Sweet')
const fruitNameLens = focalize.prop('name')
const sweetFruitNameLens = fruitLens
  .andThen(sweetFruitLens)
  .andThen(fruitNameLens)

const modified = sweetFruitNameLens.mod(data, name => name + ' iz yum!')

expect(modified).toEqual({
  fruit: [
    {
      name: 'Apple iz yum!',
      taste: 'Sweet'
    },
    {
      name: 'Pear iz yum!',
      taste 'Sweet'
    },
    {
      name: 'Lemon',
      taste: 'Sour'
    }
  ]
})
```

## References

Albert Steckermeier (1 July 2015). ["Lenses in Functional Programming"][1].

[1]: https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf
