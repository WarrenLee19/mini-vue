// 可以使用简单的 Proxy 来实现
import {track, trigger} from "./effect";

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)

            track(target,key)
            return res
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value)
            trigger(target,key)
            return res
        },
    })
}