import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
    IS_REACTIVE="_v_isReactive",
    IS_READONLY="_v_isReadonly",
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

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}