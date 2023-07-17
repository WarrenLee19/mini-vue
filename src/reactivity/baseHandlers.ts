// reactivity/baseHandlers.ts
import { track, trigger } from './effect'
import {extend, isObject} from "../shared";
import {reactive, ReactiveFlags, readonly} from "./reactive";

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true,true)
const shallowMutableGet = createGetter(false, true)
const set = createSetter()

function createGetter(isReadonly = false,isSallowReadonly?) {
    return function get(target, key, receiver) {
        if(key ===  ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }else if(key === ReactiveFlags.IS_READONLY){
            return isReadonly
        }else if (key === ReactiveFlags.RAW) {
            // 判断一下，如果访问的 key 是 ReactiveFlag.RAW，就直接返回就可以了
            return target
        }

        const res = Reflect.get(target, key, receiver)

        if(isSallowReadonly){
            return res
        }

        //判断是否为object
        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res)
        }

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

// 这里我们发现 shalloReadonlyHandlers 和 readonly 的 set 一样
// 就可以复制一份，复写 get 就好了
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

export const shallowReactiveHandlers = extend({}, mutableHandlers, {
    get: shallowMutableGet,
});
