import {ReactiveEffect} from "./effect";

class ComputedTpl{
    private _getter: any;
    private _value: any;
    private _effect: any
    private _dirty: boolean = true;
    constructor(getter) {
        this._getter = getter
        // 这里需要内部维护一个 ReactiveEffect 实例
        this._effect = new ReactiveEffect(getter, {
            scheduler: () => {
                // 在 scheduler 中把锁打开
                this._dirty = true
            },
        })
    }
    get value(){
        if(this._dirty){
            this._value = this._effect.run()
            this._dirty = false
        }
        return this._value
    }

}

export function computed(getter){
    return new ComputedTpl(getter)
}