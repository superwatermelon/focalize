# Focalize

A functional lens framework. **WIP**.

Helps with immutability, immutability is useful for retaining intermediate
state, this means we can perform multiple activities on the same source data
without worries that it might be modified during one of these activities.

## Notes

We want to be able to do something powerful such as updating (immutably, that
is by returning an updated copy and leaving the original intact) items within
an array that match a predicate:

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
const sweetFruitLens = focalize.arrayFilter(item => item.taste === 'Sweet')
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

- [Scalaz][scalaz]
- [Shapeless][shapeless]
- Albert Steckermeier (1 July 2015). ["Lenses in Functional Programming"][1].

[scalaz]: https://github.com/scalaz/scalaz
[shapeless]: https://github.com/milessabin/shapeless
[1]: https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf
