// reactivity/baseHandlers.ts
import { track, trigger } from './effect'

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()

function createGetter(isReadonly = false) {
    return function get(target, key, receiver) {
        if(key === '_v_isReactive'){
            return !isReadonly
        }else if(key === '_v_isReadonly'){
            return isReadonly
        }

        const res = Reflect.get(target, key, receiver)
        // 在 get 时收集依赖
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter() {
    return function set(target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        // 在 set 时触发依赖
        trigger(target, key)
        return res
    }
}

// mutable 可变的
export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        // 在这里警告
        console.warn(
            `key: ${key} set value: ${value} fail, because the target is readonly`,
            target
        )
        return true
    },
}
