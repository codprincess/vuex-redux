## 对vue路由的理解---vue-router

vue的路由提供两种不同方式的路由hash和history,vue-router中使用外观模式将几种不同的路由方式提供给一个一致的高层接口.

在vue-router中以mode的方式区分路由的模式
```js
    const router =  new vue-router({
        mode:'history',//不写的话就是hash模式
        routes:[....]
    })
```

##### hash
简单来说就是hash方法带有 # .通过监听#后面的url变化触发浏览器的hashchange事件

由于之前我们对react的路由进行分析时,已经比较详细的描述了hash和history

直接来定义vue的路由和用法(作为一个前端的代码搬运工我们首先要学会运用~~)

```js
   //首先我们要 npm install vue-router --save
   //初始化vue-router
   Vue.use(Router)
   export default new Router({
  routes: [
      //映射路由
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/Products',
      name:'Products',
      component: Products
    }
  ]
})
```
嵌套路由就是加上children就可以了.

##### v-link指令
使用v-link指令可以跳转到指定页面
```js
   <a class="list-group-item" v-link="{ path: '/home'}">Home</a>
```
##### router-view
用于渲染匹配的组件,不可缺少

##### router.redirect
重定向路由
```js
const router = new VueRouter({
  routes: [
    { path: '/', 
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
      redirect: to =>{
                if(store.state.user.roles && store.state.user.roles.includes('admin'))return '/a';
                if(store.state.user.roles && store.state.user.roles.includes('manager'))return '/b';
                if(store.state.user.roles && store.state.user.roles.includes('check'))return '/c';
                return '/draft'
            },
    }}
  ]
})
```

#### vue路由跳转的四种方式(带参数)

1.  router-link
```js

1.不带参数
<router-link :to="{name:'home'}"> 
<router-link :to="{path:'/home'}"> //name,path都行, 建议用name  
// 注意：router-link中链接如果是'/'开始就是从根路由开始，如果开始不带'/'，则从当前路由开始。
2.带参数
<router-link :to="{name:'home', params: {id:1}}">  
// params传参数 (类似post)
// 路由配置 path: "/home/:id" 或者 path: "/home:id" 
// 不配置path ,第一次可请求,刷新页面id会消失
// 配置path,刷新页面id会保留
// html 取参  $route.params.id
// script 取参  this.$route.params.id
<router-link :to="{name:'home', query: {id:1}}"> 
// query传参数 (类似get,url后面会显示参数)
// 路由可不配置
 
// html 取参  $route.query.id
// script 取参  this.$route.query.id

```








就我个人而言,vue的路由要比react的路由简单

