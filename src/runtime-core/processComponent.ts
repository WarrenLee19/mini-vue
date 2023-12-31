import {patch} from "./render";
import {componentPublicInstanceProxyHandlers} from "./componentPublicInstanceProxyHandlers";

export function processComponent(vnode, container) {
    mountComponent(vnode, container)
}
function mountComponent(vnode, container) {
    // 通过 vnode 获取组件实例
    const instance = createComponentInstance(vnode)
    // setup component
    setupComponent(instance, container)
    // setupRenderEffect
    setupRenderEffect(instance,vnode, container)
}
export function createComponentInstance(vnode) {
    // 这里返回一个 component 结构的数据
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    }
    return component
}
export function setupComponent(instance, container) {
    // 初始化分为三个阶段
    // TODO initProps()
    // TODO initSlots()
    // 处理 setup 的返回值
    // 这个函数的意思是初始化一个有状态的 setup，这是因为在 vue3 中还有函数式组件
    // 函数式组件没有状态
    setupStatefulComponent(instance, container)
}
function setupStatefulComponent(instance, container) {
    // 这个函数的处理流程其实非常简单，只需要调用 setup() 获取到返回值就可以了
    // 那么第一步我们就是要获取用户自定义的 setup
    // 通过对初始化的逻辑进行梳理后我们发现，在 createVNode() 函数中将 rootComponent 挂载到了 vNode.type
    // 而 vNode 又通过 instance 挂载到的 instance.vnode 中
    // 所以就可以通过这里传入的 instance.vnode.type 获取到用户定义的 rootComponent
    const component = instance.vnode.type

    // 在这里对于 instance 的 this 进行拦截
    instance.proxy = new Proxy({ _: instance }, componentPublicInstanceProxyHandlers)

    // 拿到 component 我们就可以拿到 setup 函数
    const { setup } = component
    // 这里需要判断一下，因为用户是不一定会写 setup 的，所以我们要给其一个默认值
    if (setup) {
        // 获取到 setup() 的返回值，这里有两种情况，如果返回的是 function，那么这个 function 将会作为组件的 render
        // 反之就是 setupState，将其注入到上下文中
        const setupResult = setup()
        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult) {
    // TODO function
    // 这里先处理 Object 的情况
    if (typeof setupResult === 'object') {
        // 如果是 object ，就挂载到实例上
        instance.setupState = setupResult
    }
    // 最后一步，调用初始化结束函数
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    // 这里为了获取 component 方便，我们可以在 instance 上加一个 type 属性
    // 指向 vnode.type
    const component = instance.type
    // 如果 instance.render 没有的话，我们就让 component.render 赋给 instance.render
    // 而没有 component.render 咋办捏，其实可以通过编译器来自动生成一个 render 函数
    // 这里先不写
    // if (instance.render) {
        instance.render = component.render
    // }
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    // 将转换好的 component 进行 element 分支的 patch
    patch(subTree, container)
    // 通过 patch，走到 mountElement 方法中，将传入的 subTree.el 变成为根节点
    // 在这里再将 vnode.el = subTree.el 即可
    vnode.el = subTree.el
}