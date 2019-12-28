# vuex-redux
曲曲折折编程之30分钟同级区分vuex和redux,新手上手快
## 什么是vuex
简而言之就是专门为Vue.js设计的状态管理模式 <br/>

vuex包含5个核心概念:State，Getter，Mutation，Action，Module

平时我们写的简单vue文件中，包含data，template，methods

### State  --->data 看作 state，驱动应用的数据源，也就是定义的变量

State是用来存储原始数据的。
``` js
    //State的简单实现
    const store = {
        state: {
            count: 0,
            list:{...},
            listArray:[...]
        },
    }
    //页面的直接的使用方法
    import store from '.....' //页面引入store文件
    //可以在vue页面的data里面直接赋值
    data(){
        return {
            count:store.state.count,
            list:store.state.list
        }
    }
```
以上的引入方法可行,但是有弊端,现在的store.state谁都可以用和修改,为了避免这个bug,我们用Mutation

### Mutation :Mutation是用来修改数据的

mutation是更改 Vuex 的 store.state的唯一方法

注意:mutation函数中不许出现异步操作

``` js
    // store/app.js例子
     mutations: {
        //增加
        [INCREMENT](state,n) {
            state.count += n;
        },
        //减少
        [DESCREMENT](state,n) {
            state.count -= n
        }
    },
```
既然mutation函数中不许出现异步操作,那么我们的axios之类的http请求在哪里写呢?

有不足肯定会有解决的方法,就像我们说的:没有解决不了的bug,是在不行就换个实现方式(直接该需求,哈哈哈哈)
但是有bug还是要努力改啦,那么就有了action来处理异步操作

### Action :Action可以用来分发多重 mutation，以及使用异步方法
```js
    //硬生生把同步变成异步的骚操作
     actions: {
        //写异步逻辑
        async myIncrement(context, obj) {
            context.commit('INCREMENT', 2);
            const product = [1, 2, 3]
            return product
        },
        myDescrement(context) {
            context.commit('DESCREMENT', 1)
        }
    }
```
当然实际上我们就不能这样写了,会有axios请求啥的,

``` js
    //看这个购物车例子,涉及到调用异步API和分发多重mutation
    checkout({commit,state},products){
        // 把当前购物车的物品备份起来
        const savedCartItems = [...state.items]
        // 发出结账请求，然后乐观地清空购物车
        commit(types.CHECKOUT_REQUEST)
        // 购物 API 接受一个成功回调和一个失败回调
        shop.buyProducts(
            products,
            // 成功操作
            () => commit(types.CHECKOUT_SUCCESS),
            // 失败操作
            () => commit(types.CHECKOUT_FAILURE, savedCartItems)
        )
    },
```
Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态
简单来讲就是我们在mutation中写修改状态的函数方法,然后在action中通过 commit('方法','参数')来调用,action中的函数本身就不能有state修改操作.
以上是vuex中最重要的,其次还有Getter 和 Module
### Getter :Getter允许你在获取数据时，对数据做一些预处理
``` js
     getters:{
        //对product数据进行处理,只需要返回,title,price,quantity
        cartProducts: (state, getters, rootState) => {
            return state.items.map(({ id, quantity }) => {
                const product = rootState.products.all.find(product => product.id === id)
                return {
                    title: product.title,
                    price: product.price,
                    quantity
                }
            })
        },

        cartTotalPrice: (state, getters) => {
            return getters.cartProducts.reduce((total, product) => {
                //计算购物车的价钱总和,返回总金额
                return total + product.price * product.quantity
            }, 0)
        }
    },
```
### Module :Module允许你对一个大的 store 分割成独立的小模块，便于管理
![vuex](https://github.com/codprincess/vuex-redux/blob/master/img/1.png)
