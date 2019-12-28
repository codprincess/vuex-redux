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


### Action




