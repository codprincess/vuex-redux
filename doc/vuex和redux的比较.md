### Vuex和redux的比较
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
#### mapState 辅助函数(对应State,各种使用方法,参考本片例子)
当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性

以上的引入方法可行,但是有弊端,现在的store.state谁都可以用和修改,为了避免这个bug,我们用Mutation

### Mutation :Mutation是用来修改数据的

mutation是更改 Vuex 的 store.state的唯一方法,不过，mutation触发状态改变的方式有一点特别，所谓commit一个mutation，实际是像触发一个事件一样，传入一个mutation的类型以及携带一些数据（称作payload，载荷）。

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
#### mapMutations(对应Mutation)
辅助函数将组件中的 methods 映射为 this.$store.commit,更多使用方式请看例子
```js
     ...mapMutations(['increment','descrement']),
     increments(){
       this.increment()
     },
     descrements(){
      this.descrement()
    }
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

那么问题来了,我们是怎么触发action的呢?在vuex里面管它叫分发(dispatch).具体的触发方法是this.$store.dispatch(actionType, payload)。所传的两个参数一个是要触发的action的类型，一个是所携带的数据（payload），类似于上文所讲的commit mutation(commit('方法','参数'))时所传的那两个参数。具体如下：
```js
    //以载荷形式分发
    this.$store.dispatch('cart/checkout', products)
```
还有一种方法是使用 mapActions 辅助函数将组件的 methods 映射为 this.$store.dispatch调用。如下：
```js
import { mapActions } from 'vuex'
 ...mapActions(['myIncrement','myDescrement']),
    increments(){
      this.myIncrement();
    },
    descrements(){
      this.myDescrement();
    }
```
以上是vuex中最重要的,其次还有Getter 和 Module
### Getter :Getter允许你在获取数据时，对数据做一些预处理
对于模块内部的 getter，根节点状态会作为第三个参数暴露出来
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
#### mapGetters 辅助函数(对应Getter)
可以通过this.$store.getters.valueName对派生出来的状态进行访问。或者直接使用辅助函数mapGetters将其映射到本地计算属性中去。
```js
     ...mapGetters('cart',{
            products:'cartProducts',
            total:'cartTotalPrice'
        })
```

### Module :Module允许你对一个大的 store 分割成独立的小模块，便于管理
这个Module也什么好讲的啦,但是要注意一点就是namespaced: true,如果两个模块之间有公用的方法,那么我们要有namespaced: true,可以直接在模块上定义,具体看例子啦,引用的方式就是,前面写上文件名字后面跟着方法,
```js
//这是在store模块上
commit('products/decrementProductInventory', { id: product.id }, { root: true })
//这是在vue页面上,带命名空间的绑定函数
this.$store.dispatch('products/getAllProducts')
//带命名空间的参数获取
  ...mapState({
    checkoutStatus:state=>state.cart.checkoutStatus
  }),

```
```js
      //整理store合集
    modules:{
        app,
        user,
        products,
        cart
    }
```
Vuex总结:
1、应用层级的状态应该集中到单个 store 对象中，状态对象太复杂的时候可以划分module。

2、提交 mutation 是更改状态的唯一方法。

3、在触发方法上：action的触发是dispatch,mutation的触发是commit；

4、在功能上：state保存的是数据,getters是对state进行二次加工,action的处理函数的功能最终是commit mutation,mutation处理函数的功能最终是改变state

5、在同步异步上：异步逻辑都应该封装到 action 里面,mutation 是同步的，不能出现异步

6、在流程上：
vue component—-dispatch—->actions—-commit—->mutations—-mutate—->state—-render—->vue component。从而形成闭环。

7、辅助方法的映射上：

mapGetters、mapState 都是用在computed声明里面；

mapActions、mapMutations则都是用在methods声明里面。
#### 单向数据流
![vuex](https://github.com/codprincess/vuex-redux/blob/master/img/1.png)
#### vuex的流程

![vuex](https://github.com/codprincess/vuex-redux/blob/master/img/2.png)