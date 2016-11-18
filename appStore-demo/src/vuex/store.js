import Vuex from 'vuex';

const state = { //使用单一状态树,用一个对象包含全部应用层级状态
    //尽可能在创建时就初始化所有的属性 添加属性用Vue.set或拷贝替换 state.obj = { ...state.obj, newProp: 123 }
    count: 0
}

const mutations = { //不能直接改变store,状态变更事件(explicitly dispatching mutations)。是改变state的唯一途径
    //必须是同步函数，异步请用actions,第一个参数永远为store的整个state对象 触发方法 store.dispatch('INCREMENT')
    INCREMENT(state) {
        state.count++
    }
}

const actions = { //异步调用
    //用户在组件中的输入操作触发 action 调用；
    //Actions 通过分发 mutations 来修改 store 实例的状态；
    //Store 实例的状态变化反过来又通过 getters 被组件获知。
    increment: ({ dispatch }) => dispatch('INCREMENT')
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
});

/*应用 state 存在于单个对象中；
只有 mutation handlers 可以改变 state；
Mutations 必须是同步的，它们做的应该仅仅是改变 state；
所有类似数据获取的异步操作细节都应封装在 actions 里面。
组件通过 getters 从 store 中获取 state，并通过调用 actions 来改变 state。
可以把 actions 和 mutations 分离到各自的文件0或者用模块进行组织：
提取共用的 Computed Getters*/