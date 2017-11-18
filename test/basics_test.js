const expect = require('expect')
const focalize = require('../src')

describe('Basic Usage', () => {
  describe('Object literal lens', () => {

    const lens = focalize.prop('name');
    const a = {
      name: 'Bob',
      department: 'R&D'
    };
    const b = lens.set(a, 'Greg');
    const c = lens.mod(a, (v) => v + v.substr(-1) + 'y');

    it('can be used to set a property on an object literal returning a copy with the new property value', () => {
      expect(b).toEqual({
        name: 'Greg',
        department: 'R&D'
      });
    });

    it('does not alter the original object when setting a new property value', () => {
      expect(a).toEqual({
        name: 'Bob',
        department: 'R&D'
      });
    });

    it('can be used to get the property value of the object literal', () => {
      expect(lens.get(b)).toBe('Greg');
    });

    it('can also modify a property value by applying a function to the old value', () => {
      expect(c).toEqual({
        name: 'Bobby',
        department: 'R&D'
      });
    });
  });

  describe('Example', () => {

    const department = {
      employees: [
        { name: 'Gracie', terminated: false },
        { name: 'Bob', terminated: false }
      ]
    };

    const result = focalize.prop('terminated')
      .composeTraversal(focalize.select(employee => employee.name === 'Bob'))
      .composeLens(focalize.prop('employees'))
      .set(department, true);

    it('fires Bob', () => {
      expect(result).toEqual({
        employees: [
          { name: 'Gracie', terminated: false },
          { name: 'Bob', terminated: true }
        ]
      })
    });
  });

  describe('Basic lens', () => {
    it('provides the most simplistic lense an identity lense', () => {
      const lens = focalize.lens(
        s => s,
        (s, v) => v
      )

      expect(lens.get('Bob')).toBe('Bob')
      expect(lens.set('Bob', 'Fred')).toBe('Fred')
    })

    it('can be applied to an array', () => {
      const lens = focalize.lens(
        s => s,
        (s, v) => v
      )

      expect(['Bob', 'Craig', 'Winston'].map(name => lens.get(name))).toEqual(['Bob', 'Craig', 'Winston'])
      expect(['Bob' , 'Craig', 'Winston'].map(name => lens.set(name, 'Freddo'))).toEqual(['Freddo', 'Freddo', 'Freddo'])
      expect(['Bob' , 'Craig', 'Winston'].map(name => lens.mod(name, name => name + 'ly'))).toEqual(['Bobly', 'Craigly', 'Winstonly'])
    })

    const d = v => {
      console.log(v);
      return v;
    }

    const df = f => {
      console.log(f.toString())
      return f;
    }

    it('array traversal', () => {
      const traversal = focalize.every()
      expect(traversal.getAll(['Bob', 'Craig', 'Winston'])).toEqual(['Bob', 'Craig', 'Winston'])
      expect(traversal.set(['Bob' , 'Craig', 'Winston'], 'Freddo')).toEqual(['Freddo', 'Freddo', 'Freddo'])
      expect(traversal.mod(['Bob' , 'Craig', 'Winston'], name => name + 'ly')).toEqual(['Bobly', 'Craigly', 'Winstonly'])
    });

    it('array select lens', () => {
      const traversal = focalize.select(name => name === 'Bob')
      expect(traversal.getAll(['Bob', 'Craig', 'Winston'])).toEqual(['Bob'])
      expect(traversal.set(['Bob' , 'Craig', 'Winston'], 'Freddo')).toEqual(['Freddo', 'Craig', 'Winston'])
      expect(traversal.mod(['Bob' , 'Craig', 'Winston'], x => x + 'ly')).toEqual(['Bobly', 'Craig', 'Winston'])
    });

    it('lens traversable', () => {
      const bob = { name: 'Bob', terminated: false };
      const traversal = focalize.prop('terminated').asTraversal()
      expect(traversal.getAll(bob)).toEqual([false])
      expect(traversal.set(bob, true)).toEqual({
        name: 'Bob',
        terminated: true
      })
      expect(traversal.mod(bob, terminated => !terminated)).toEqual({
        name: 'Bob',
        terminated: true
      })
    })

    it('array select compose', () => {
      const employees = [
        { name: 'Bob', terminated: false },
        { name: 'Craig', terminated: false },
        { name: 'Winston', terminated: false }
      ]
      // const lens = arrayCompose(prop('terminated'), select(employee => employee.name === 'Bob'))
      // Take a look at twan van laardhoven's doc https://www.twanvl.nl/files/lenses-talk-2011-05-17.pdf

      const traversal = focalize.prop('terminated')
        .composeTraversal(focalize.select(employee => employee.name === 'Bob'))
      expect(traversal.getAll(employees)).toEqual([ false ])
      expect(traversal.set(employees, true)).toEqual([
        { name: 'Bob', terminated: true },
        { name: 'Craig', terminated: false },
        { name: 'Winston', terminated: false }
      ])
      expect(traversal.mod(employees, terminated => !terminated)).toEqual([
        { name: 'Bob', terminated: true },
        { name: 'Craig', terminated: false },
        { name: 'Winston', terminated: false }
      ])
    });

    it('a complex case', () => {
      const company = {
        name: 'ACME LTD',
        departments: [
          {
            name: 'Human Resources',
            staff: [
              {
                name: 'Laura',
                salary: 34000
              },
              {
                name: 'Sidney',
                salary: 32000
              }
            ]
          },
          {
            name: 'Research and Development',
            staff: [
              {
                name: 'Dave',
                salary: 42000
              }
            ]
          }
        ]
      }

      // Using compose we start with the property that is the target
      // i.e. the most specific element.
      const traversal = focalize.prop('salary')

        // We use a traversal if more than one person can match
        .composeTraversal(focalize.select(employee => employee.name === 'Sidney'))
        .composeLens(focalize.prop('staff'))
        .composeTraversal(focalize.select(department => department.name === 'Human Resources'))
        .composeLens(focalize.prop('departments'))

      expect(traversal.getAll(company)).toEqual([32000])
      expect(traversal.set(company, 32500)).toEqual({
        name: 'ACME LTD',
        departments: [
          {
            name: 'Human Resources',
            staff: [
              {
                name: 'Laura',
                salary: 34000
              },
              {
                name: 'Sidney',
                salary: 32500
              }
            ]
          },
          {
            name: 'Research and Development',
            staff: [
              {
                name: 'Dave',
                salary: 42000
              }
            ]
          }
        ]
      })
      expect(traversal.mod(company, salary => salary + 3000)).toEqual({
        name: 'ACME LTD',
        departments: [
          {
            name: 'Human Resources',
            staff: [
              {
                name: 'Laura',
                salary: 34000
              },
              {
                name: 'Sidney',
                salary: 35000
              }
            ]
          },
          {
            name: 'Research and Development',
            staff: [
              {
                name: 'Dave',
                salary: 42000
              }
            ]
          }
        ]
      })

      // Using compose we start with the property that is the target
      // i.e. the most specific element.
      const traversal2 = focalize.prop('salary')

        // We use a traversal if more than one person can match.
        .composeTraversal(focalize.select(employee => employee.name.search(/e/) !== -1))
        .composeLens(focalize.prop('staff'))
        .composeTraversal(focalize.every())
        .composeLens(focalize.prop('departments'))

      expect(traversal2.mod(company, salary => salary + 10000)).toEqual({
        name: 'ACME LTD',
        departments: [
          {
            name: 'Human Resources',
            staff: [
              { name: 'Laura', salary: 34000 },
              { name: 'Sidney', salary: 42000 }
            ]
          },
          {
            name: 'Research and Development',
            staff: [
              { name: 'Dave', salary: 52000 }
            ]
          }
        ]
      });

      const lens = focalize.prop('salary')
        .composeLens(focalize.prop(0))
        .composeLens(focalize.prop('staff'))
        .composeLens(focalize.prop(0))
        .composeLens(focalize.prop('departments'))

      expect(lens.get(company)).toBe(34000)
    });


  });

  describe('Usage for action reducers', () => {

    const empty = {};
    const singleMatch = {
      departments: [
        {
          name: 'Sales',
          staff: [
            { id: 101, name: 'James', salary: 13000 },
            { id: 123, name: 'Jeff', salary: 16000 }
          ]
        }
      ]
    };
    const multipleMatch = {
      departments: [
        {
          name: 'Sales',
          staff: [
            { id: 101, name: 'James', salary: 13000 },
            { id: 123, name: 'Jeff', salary: 16000 }
          ]
        },
        {
          name: 'Support',
          staff: [
            { id: 123, name: 'Jeff', salary: 16000 }
          ]
        }
      ]
    };
    const reducer = (state = {}, action) => {
      switch (action.type) {
        case 'RAISE':
          return focalize.compose(
            focalize.prop('salary'),
            focalize.select(staff => staff.id === action.staffId),
            focalize.prop('staff'),
            focalize.every(),
            focalize.prop('departments')
          ).mod(state, salary => salary + action.amount);
        default:
          return state;
      }
    }
    const action = { type: 'RAISE', staffId: 123, amount: 2000 };

    it('can handle initial state', () => {
      expect(reducer(undefined, action)).toEqual({});
    });

    it('is economical', () => {
      expect(reducer(empty, action)).toBe(empty);
    });

    it('performs complex updates', () => {
      expect(reducer(singleMatch, action)).toEqual({
        departments: [
          {
            name: 'Sales',
            staff: [
              { id: 101, name: 'James', salary: 13000 },
              { id: 123, name: 'Jeff', salary: 18000 }
            ]
          }
        ]
      })
    });

    it('updates all matching', () => {
      expect(reducer(multipleMatch, action)).toEqual({
        departments: [
          {
            name: 'Sales',
            staff: [
              { id: 101, name: 'James', salary: 13000 },
              { id: 123, name: 'Jeff', salary: 18000 }
            ]
          },
          {
            name: 'Support',
            staff: [
              { id: 123, name: 'Jeff', salary: 18000 }
            ]
          }
        ]
      })
    });
  });
});
