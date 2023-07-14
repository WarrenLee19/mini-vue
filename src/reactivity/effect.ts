import {extend} from "../shared";
// 需要一个全局变量来保存当前的 effect
let activeEffect

class ReactiveEffect{
    private _fn:any
    // [stop] 反向记录自己对应的 dep 那个 set
    deps = []
    // true 未调用 false 调用
    active = true
    constructor(fn,public options) {
        this._fn = fn

    }

    run(){
        // 保存一下当前的 activeEffect
        activeEffect = this
        return this._fn()
    }

    // [stop] 这个方法的作用就是去根据 this.deps 删除 this 对应的 effect
    stop() {
        cleanupEffect(this)
    }
}

// 把清除的逻辑单独作为函数
function cleanupEffect(effect) {
    if (effect.active) {
        effect.deps.forEach((dep: any) => {
            dep.delete(effect)
        })
        // [onStop] 如果存在 onStop，就去运行 onStop
        if (effect.onStop) effect.onStop()
        effect.active = false
    }
}

// 创建全局变量 targetMap
const targetMap = new WeakMap()
export function track(target, key) {
    // 我们在运行时，可能会创建多个 target，每个 target 还会可能有多个 key，每个 key 又关联着多个 effectFn
    // 而且 target -> key -> effectFn，这三者是树形的关系
    // 因此就可以创建一个 WeakMap 用于保存 target，取出来就是每个 key 对应这一个 depsMap，而每个 depsMap 又是一个 Set
    // 数据结构（避免保存重复的 effect）
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    // 将 effect 加入到 set 中
    // 如果该 activeEffect 还没有调用 stop 方法的时候，再去添加依赖和反向收集依赖
    if (activeEffect && activeEffect.active) {
        // [stop]：反向追踪 activeEffect 的 dep
        // 因为一个 activeEffect 可能会对应多个 dep，每个 dep 是一个 set
        // 这里我们可以使用一个数组
        activeEffect.deps.push(dep)
        dep.add(activeEffect)
    }
}

export function trigger(target,key){
    let depsMap = targetMap.get(target)
    let deps = depsMap.get(key)
    for (const effect of deps) {
        if(effect.options.scheduler){
            effect.options.scheduler()
        }else {
            effect.run()
        }
    }
}

export function stop(runner) {
    // [stop] 如何获取到当前所属的 effect 实例呢？
    // 这样就可以去调用 stop 方法了
    runner.effect.stop()
}



export function effect(fn,options:any = {}){
    const _effect = new ReactiveEffect(fn,options)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    // [stop] 在这里挂载一下所属的 effect
    runner.effect = _effect
    // 其实我们可以将 options 中的所有数据全部挂载在 effect 上面
    // extend = Object.assign 封装一下是为了语义化更好
    extend(_effect, options);
    return runner
}