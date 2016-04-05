import expect from 'expect'
import focalize from '../../src'

describe('Basic usage', () => {
    describe('Object literal lens', () => {
        
        const lens = focalize.objectPropertyLens('name')
        const a = {
            name: 'Bob',
            department: 'R&D'
        }
        const b = lens.set(a, 'Greg')
        const c = lens.mod(a, (v) => v + v.substr(-1) + 'y')
        
        it('Can be used to set a property on an object literal returning a copy with the new property value', () => {
            expect(b).toEqual({
                name: 'Greg',
                department: 'R&D'
            })
        })
        
        it('Does not alter the original object when setting a new property value', () => {
            expect(a).toEqual({
                name: 'Bob',
                department: 'R&D'
            })
        })
        
        it('Can be used to get the property value of the object literal', () => {
            expect(lens.get(b)).toBe('Greg')
        })
        
        it('Can also modify a property value by applying a function to the old value', () => {
            expect(c).toEqual({
                name: 'Bobby',
                department: 'R&D'
            })
        })
    })
})