### Vuex和redux的比较之vuex(2)

## 什么是redux
Redux 是 JavaScript 状态容器，提供可预测化的状态管理.redux除了和 React 一起用外，还支持其它界面库

redux的核心概念:state,action,reducer

主要说明:要想更新state中的数据,你需要发起一个action,Action就是一个普通的JavaScript对象.使用action可以
让我们清晰的知道应用中到底发生了什么.然后为了把action和state串起来,我们就要使用reducer,reducer 只是一个接收 state 和 action，并返回新的 state 的函数.
### 安装:
```js
npm install --save redux react-redux redux-devtools redux-thunk (redux-thunk用最简单的方式搭建异步 action 构造器,我们就以它为例 )
```

### redux的三大原则
#### 单一数据源
整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。
#### State是只读
唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。
#### 使用纯函数来执行修改
为了描述 action 如何改变 state tree ，你需要编写 reducers。Reducer 只是一些纯函数，它接收先前的 

state 和 action，并返回新的 state。


### Action(分为同步操作和异步操作)
##### 同步action操作
Action 是把数据从应用,传到 store 的有效载荷。它是 store 数据的唯一来源,是普通的JavaScript对象
action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作。多数情况下，type 会被定义成字符串常量。比如下面,添加一个action value来表示完成任务的值的变化,具体看todolist(同步,每当 dispatch action 时，state 会被立即更新)的列子
```js
    export const changeInputAction = (value)=>({
        type: CHANGE_INPUT,
        value
    })
```
##### 异步action操作
当调用异步api时,发起请求和接收到响应的时候都可能会更改state,此，你需要 dispatch 普通的同步 action。一般情况下，每个 API 请求都需要 dispatch 至少三种 action：
###### . reducer 请求开始的 action: CHECKOUT_REQUEST
###### . reducer 请求成功的 action: CHECKOUT_SUCCESS
###### . reducer 请求开始的 action: CHECKOUT_FAILURE
具体代码如下
```js
const cart = (state=initState,action)=>{
    switch (action.type) {
        case CHECKOUT_REQUEST:
            return initState
        case CHECKOUT_FAILURE:
            return action.cart
        default:
            return {
                addedIds: addedIds(state.addedIds, action),
                quantityById: quantityById(state.quantityById, action)
            }
    }
}

```








