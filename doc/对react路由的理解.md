## 对react路由的理解

说到路由我们首先想到的就是url,然后各种无刷新切换页面巴拉巴拉的~~~~

那么前端的路由原理大致相同,可以实现无刷新的条件下切换显示不同的页面,当页面url发生改变是,页面的显示结果根据url的变化而变化,但是页面不会刷新,这也算是路由的一个本质吧.

(我们经常会在技术群里看到萌新问:为什么我的路由写了,点击时页面url也变化了,但是页面不跳转呢巴拉巴拉~~~?大佬:.....对方不想跟你说话,甚至给你丢了一个bug!!!)那么看完这篇总结,你就会知道了!

#### Hash实现前端路由

我们知道改变url的hash是不会刷新页面的,因此可以通过hash来实现前端路由,从而实现无刷新效果,hash属性位于location中，在当前页面中，可以通过：
```js
window.location.href = 'edit'
```
来实现改变当前url的hash值，执行上述的hash赋值，页面的url发生改变。出现我们非常熟悉的(#)(#edit).

在url中多了以#结尾的hash值，但是赋值前后虽然页面的hash值改变导致页面完整的url发生了改变，但是页面是不会刷新的。此外，还有一个监听hash的事件，就是hanshChange事件，下面通过两种方式监听：
```js
    //1
    window.onhashChange = function(e){
        console.log(e);
    }
    //2
    window.addEventListener('hashChange',function(e){
        console.log(e);
    })
```
有了监听事件，且改变hash页面不刷新，这样我们就可以在监听事件的回调函数中，执行我们展示和隐藏不同UI显示的功能，从而实现前端路由。

hash的缺点:搜索引擎对带有hash的页面不友好,带有hash的页面难以追踪用户的行为。

#### history实现前端路由
history.pushState
将当前URL和history.state加入到history中，并用新的state和URL替换当前，不会造成页面刷新<br/>
state：与要跳转到的URL对应的状态信息<br/>
title：title<br/>
url：要跳转到的URL地址，不能跨域<br/>
pushState会向浏览器的历史堆栈添加一个url为设定值的记录，并指向当前项<br/>
history.replaceState,与pushState参数，含义相同
区别在于replaceState是替换浏览器历史堆栈的当前历史记录为设定的url
replaceState不会改动浏览器历史堆栈的当前指向
```js
    <ul>
        <li><a href="?name=red">A</a></li>
        <li><a href="?name=blue">B</a></li>
        <li><a href="?name=green">C</a></li>
    </ul>
    <div style='width: 100px; height: 100px;'></div>
    <script>
        function setBackgroundColor(color) {
            document.querySelector('div').style.backgroundColor = color;
        }
        // 将页面替换成当前url的页面
        history.replaceState({
            color: 'red'
        }, '当前为A页面', "?name=a");
        setBackgroundColor("red");

        // 浏览器前进后退就会触发popstate事件， 通过事件的 state 可以获得参数值
        window.onpopstate = function (event) {
            // console.log(event.state);
            setBackgroundColor(event.state.color);
        }

        let aObj = document.querySelectorAll('a');
        aObj.forEach((item) => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                // 请求地址
                let query = this.href.split('?')[1];
                // 请求的参数值
                let color = query.split('=')[1];
                // history.state：获取历史栈中最顶端的state数据（即history.pushState中的第一个参数）
                if(history.state.color !== color) {
                    setBackgroundColor(color);
                    // 放入历史记录中
                    history.pushState({color: color},color, location.href.split('?')[0] + '?' + query);
                }
            })
        })
</script>
```
好了,前面是说点理论,现在进入正题了,在react中的router

#### React-router4.0的使用

在React-router4.0的代码库中，根据使用场景包含了以下几个独立的包：
react-router : react-router4.0的核心代码
react-router-dom : 构建网页应用，存在DOM对象场景下的核心包
react-router-native : 适用于构建react-native应用
react-router-config : 配置静态路由
react-router-redux : 结合redux来配置路由，已废弃，不推荐使用。

##### 核心api:BrowserRouter、Route、Link、Switch

##### BrowsersRouter
组件包裹整个App系统后，就是通过html5的history来实现无刷新条件的前端路由。
##### <Route>(定义匹配规则和渲染规则)

<Route> 组件十分重要，<Route> 做的事情就是匹配相应的location中的地址，匹配成功后渲染对应的组件。下面我们来看<Route>中的属性。

首先来看如何执行匹配，决定<Route>地址匹配的属性：

    path：当location中的url改变后，会与Route中的path属性做匹配，path决定了与路由或者url相关的渲染效果。

    exact: 如果有exact，只有url地址完全与path相同，才会匹配。如果没有exact属性，url的地址不完全相同，也会匹配。(重要!!!!!)

    strict ：与exact不同，strict属性仅仅是对exact属性的一个补充，设置了strict属性后，严格限制了但斜线“／”。
    <Route strict  path='/home/' component={Home}/> 那么此时严格匹配斜线是否存在，http://localhost:3000/home 将无法匹配到Home组件

    component：该属性接受一个React组件，当url匹配成功，就会渲染该组件

    render：func 该属性接受一个返回React Element的函数，当url匹配成功，渲染覆该返回的元素

    children：与render相似，接受一个返回React Element的函数，但是不同点是，无论url与当前的Route的path匹配与否，children的内容始终会被渲染出来。
我们一般的用法
```js
 <BrowserRouter>
    <Route path='/' exact component={Prices}></Route>
    <Route path='/counts' exact component={Counts}></Route>
    <Route path='/life' exact component={Life}></Route>
    <Route path='/todolist' exact component={TodoList}></Route>
</BrowserRouter>
```

##### <Link>
<Link> 决定的是如何在页面内改变url，从而与相应的<Route>匹配.
```js
//一般用法:
<Link to='/home'>Home</Link>//to作为字符串

//to作为一个对象,包含以下四个属性，传递参数
 <Link to={{pathname:'/home',search:'?sort=name',hash:'#edit',state:{a:1}}}>Home</Link>

 <Link to={
        {
          pathname:`/要跳转的路径`,
          state:{key值：val值}
        }
      }>

 //在跳转页面接收
 componentWillMount(){
     //console.log(this.props.location)//传递过来的所有参数
     console.log(this.props.location.state.key值)//val值
 }
```

##### switch
有<Switch>标签，则其中的<Route>在路径相同的情况下，只匹配第一个，这个可以避免重复匹配；
无<Switch>标签，则其中的<Route>在路径相同的情况下全都会匹配。更严重的是，还会匹配上级路径的

##### 嵌套路由
```js
 <HashRouter>
    <App></App>
    <Switch>
        <Route path="/" render={()=>
            <Admin>
                <Switch>
                    <Route path='/home' component={Home}></Route>
                    <Route path="/general/buttons" component={Buttons}></Route>
                    <Route path="/general/Icons" component={Icons}></Route>
                    <Route path="/general/loadings" component={Loadings}></Route>
                    <Route path="/general/modals" component={Modals}></Route>
                    <Route path="/general/notifications" component={Notifications}></Route>
                    <Route path="/general/tabs" component={TabsR}></Route>
                    <Route path="/general/carousels" component={Carousels}></Route>
                    <Route path="/general/editor" component={Editors}></Route>
                    <Route path="/general/messages" component={Messages}></Route>
                    <Route path="/general/draggable" component={Drag}></Route>
                    <Route path="/basictable/BasicTable" component={BasicTable}></Route>
                    <Route path="/basictable/highTable" component={HighTable}></Route>
                    <Route path="/form/register" component={Register}></Route>
                    <Route path="/form/login" component={Logins}></Route>
                    <Route path="/form/stepForm" component={StepForm}></Route>
                    <Route path="/form/testForm" component={TestForm}></Route>
                    <Route path="/user/user" component={User}></Route>
                    <Route path="/user/user2" component={User2}></Route>
                    <Route path="/city/city" component={City}></Route>
                    <Route path="/order/index" component={Order}></Route>
                    <Route path="/permission/index" component={Permission}></Route>
                    <Redirect to="/home" />
                </Switch>
            </Admin>
        }></Route>
    </Switch>
</HashRouter>
```




