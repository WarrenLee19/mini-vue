// vnode.ts
export function createVNode(type: any, props?: undefined, children?: undefined) {
    // 这里先直接返回一个 VNode 结构，props、children 非必填
    return {
        type,
        props,
        children,
        // 再创建 vnode 时创建一个空的 el
        el: null,
    }
}