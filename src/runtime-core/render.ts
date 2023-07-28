// render.ts
import {processComponent} from "./processComponent";
import {isObject} from "../shared";
import {processElement} from "./processElement";

export function render(vnode, container) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(vnode, container)
}

export function patch(vnode, container) {
    // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
    // 如果是 element 就去处理 element 的逻辑
    // 因为两次的 vnode.type 的值不一样，所以我们就可以根据这个来进行判断了
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}
