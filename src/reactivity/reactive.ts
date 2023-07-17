import {mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers} from './baseHandlers'

// 创建 RAW 枚举
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw',
}

function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}
export function isReactive(values) {
    return !!values[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(values) {
    return !!values[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}

export function isProxy(wrapped) {
    return isReactive(wrapped) || isReadonly(wrapped)
}
export function shallowReactive(raw){
    return createActiveObject(raw, shallowReactiveHandlers)
}

export function toRaw(observed) {
    // 这里就是嵌套转换了
    const original = observed && observed[ReactiveFlags.RAW]
    return isProxy(original) ? toRaw(original) : original
}