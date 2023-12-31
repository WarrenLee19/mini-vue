import {isReactive, reactive} from "../reactive";
// 编写 reactive 的 happy path
describe('reactive', () => {
    it('happy path', () => {
        const original = { foo: 1 }
        const observed = reactive(original)
        // 期望包装后和源对象不一样
        expect(observed).not.toBe(original)
        // 期望包装后某个属性的值和源对象一样
        expect(observed.foo).toBe(original.foo)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
    })
    it('nested reactive', () => {
        const original = {
            nested: { foo: 1 },
            array: [{ bar: 2 }],
        }
        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
})