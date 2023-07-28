const publicPropertiesMap:any = {
    $el: (i: { vnode: { el: any; }; }) => i.vnode.el
};

export const componentPublicInstanceProxyHandlers = {
    get({ _: instance}: any, key: string) {
        const { setupState } = instance
        if(key in setupState){
            return setupState[key]
        }
        // 如果我们访问的是 this.$el，那么就会返回 vnode.el
        const publicGetter = publicPropertiesMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    },
}