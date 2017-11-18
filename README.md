# Focalize
### Functional Lenses for Javascript

Focalize provides a composable set of functionality to handle
immutable data updates.

## Example

In order to update state immutably we might use the object spread
operator and `map` / `reduce` over arrays as follows:

```js
// vanilla-reducer.js
export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'FIRE':
      return {
        ...state,
        departments: (state.departments || []).map(department => ({
          ...department,
          employees: (department.employees || []).map(employee =>
            (employee.staffId === event.staffId) ? ({
              ...employee,
              terminated: true
            }) : employee)
        }))
      });
    default:
      return state;
  }
};
```

Focalize increases readibility by providing a composable API that
can be used to both query and update data immutably. The same example
using Focalize becomes.

```js
// lensed-reducer.js
import { prop, select, every, compose } from 'focalize';

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'FIRE':
      return compose(
        prop('terminated'),
        select(employee => employee.staffId === event.staffId),
        prop('employees'),
        every(),
        prop('department')
      ).set(state, true);
    default:
      return state;
  }
};
```

Also note that in the top example if the employee does not exist
or is already terminated we still end up with a new state object.

Focalize performs updates economically, we retain the existing
objects if no changes are required, and hence we can use
`state === result` to check for changes.

```js
import { reducer as lensedReducer } from './lensed-reducer';

const state = {
  departments: [
    {
      name: 'Research',
      employees: [
        {
          staffId: '101',
          name: 'Francis',
          terminated: false
        },
        {
          staffId: '123'
          name: 'Bob',
          terminated: true
        }
      ]
    }
  ]
};

// Bob already terminated, no changes required
assert(lensedReducer(state, {
  type: 'FIRE',
  staffId: '123'
}) === state); // => OK!
```

For more examples see the `test` folder for basic and advanced usage
as well as usage for each operator.

## References

- [Monocle][monocle]
- [Scalaz][scalaz]
- [Shapeless][shapeless]
- Albert Steckermeier (1 July 2015). ["Lenses in Functional Programming"][1].
- Twan Van Laarhoven. ["Lenses: viewing and updating data structures in Haskell"][2]

[monocle]: http://julien-truffaut.github.io/Monocle/
[scalaz]: https://github.com/scalaz/scalaz
[shapeless]: https://github.com/milessabin/shapeless
[1]: https://www21.in.tum.de/teaching/fp/SS15/papers/17.pdf
[2]: https://www.twanvl.nl/files/lenses-talk-2011-05-17.pdf
