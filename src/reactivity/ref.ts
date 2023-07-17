import {trackEffect, triggerEffect} from "./effect";
import {hasChanged, isObject} from "../shared";
import {reactive} from "./reactive";
const enum RefFlags {
    IS_REF = '__v_isRef',
}
class RefImp{
    private _value: any;
    public deps = new Set()
    constructor(value) {
        this._value =  isObject(value) ? reactive(value) : value
        this[RefFlags.IS_REF] = true
    }

    get value(){

        trackEffect(this.deps)
        return this._value
    }

    set value(newValue){

        if(hasChanged(this._value,newValue)){
            this._value = newValue
            triggerEffect(this.deps)
        }

    }
}


export function ref(value){
    return new RefImp(value)
}
export function isRef(ref){
    return !!ref[RefFlags.IS_REF]
}
export function unRef(ref){
    return ref[RefFlags.IS_REF] ? ref.value : ref
}
export function proxyRefs(objectWithRefs){
    return new Proxy(objectWithRefs, {
        get(target, key, receiver) {
            // 自动 unRef
            return unRef(Reflect.get(target, key, receiver))
        },
        set(target, key, value, receiver) {
            // set 分为两种情况，如果原来的值是 ref，并且新的值不是 ref
            // 那么就去更新原来的 ref.value = newValue
            // 第二种情况就是原来的值是 ref，newValue 也是一个 ref
            // 那么就直接替换就 OK 了
            if (isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value)
            } else {
                return Reflect.set(target, key, value, receiver)
            }
        }
    })
}