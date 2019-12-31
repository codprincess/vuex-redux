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

