import {patch} from "./render";

export function processElement(vnode, container) {
    // 分为 init 和 update 两种，这里先写 init
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    // 此函数就是用来将 vnode -> domEl 的
    const { type: domElType, props, children } = vnode
    // 创建 dom，并将 dom 存在 vnode.el 中
    const domEl = (vnode.el = document.createElement(domElType))
    // 加入 attribute
    console.log(domElType)
    console.log(props)
    for (const prop in props) {
        domEl.setAttribute(prop, props[prop])
    }
    // 这里需要判断children两种情况，string or array
    if (typeof children === 'string') {
        domEl.textContent = children
    } else if (Array.isArray(children)) {
        // 如果是 array 就递归调用，并将自己作为 container
        mountChildren(vnode, domEl)
    }
    console.log(container)
    // 最后将 domEl 加入 dom 树中
    container.appendChild(domEl)
}
function mountChildren(vnode, container) {
    vnode.children.forEach(vnode => {
        // 如果 children 是一个 array，就递归 patch
        patch(vnode, container)
    })
}