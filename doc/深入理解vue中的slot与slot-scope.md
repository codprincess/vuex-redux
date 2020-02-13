### 对Vue插槽的理解

###### 1.什么是插槽，插槽的概念是什么？
        插槽，也就是slot，是组件的一块HTML模板，这块模板显示不显示，以及怎样显示由父组件决定，所以实际上slot的核心就是“显示不显示和怎样显示”
###### 2.插槽的分类和作用
       （1）单个插槽|默认插槽|匿名插槽

       首先是单个插槽，也可以叫默认插槽或者不具名插槽，不用设置name属性。

       单个插槽可以放在组件的任意位置，相应的具名插槽就可以有很多个，只要name属性不同就可以。

       父组件：../components/slot1/Slot1
    ``` js
       <template>
        <div class="father">
            <h3>这个是父组件</h3>
                <child>
                    <div class="tmp1">
                        <span>菜单1</span>
                        <span>菜单1</span>
                        <span>菜单1</span>
                        <span>菜单1</span>
                        <span>菜单1</span>
                        <span>菜单1</span>
                    </div>
                </child>
        </div>
    </template>
    ```
    子组件：
    ``` js
    <template>
        <div class="child">
            <h3>这里是子组件</h3>
            <slot></slot>
        </div>
    </template>
```
子组件的匿名插槽就是一下使用，被下面的这块模板使用了。
``` js
<div class="tmpl">
  <span>菜单1</span>
  <span>菜单2</span>
  <span>菜单3</span>
  <span>菜单4</span>
  <span>菜单5</span>
  <span>菜单6</span>
</div>

```
    (2)具名插槽 ../components/slot2/Slot2
    具名插槽有name属性，可以被多次调用，这三个插槽被父组件用同一套css样式显示了出来，不同的是内容上略有区别如以下列子：
    父组件：
    ```js
    <template>
    <div class="father">
        <h3>这里是父组件</h3>
        <child>
        <div class="tmpl" slot="up">
            <span>菜单1</span>
            <span>菜单2</span>
            <span>菜单3</span>
            <span>菜单4</span>
            <span>菜单5</span>
            <span>菜单6</span>
        </div>
        <div class="tmpl" slot="down">
            <span>菜单-1</span>
            <span>菜单-2</span>
            <span>菜单-3</span>
            <span>菜单-4</span>
            <span>菜单-5</span>
            <span>菜单-6</span>
        </div>
        <div class="tmpl">
            <span>菜单->1</span>
            <span>菜单->2</span>
            <span>菜单->3</span>
            <span>菜单->4</span>
            <span>菜单->5</span>
            <span>菜单->6</span>
        </div>
        </child>
    </div>
    </template>
    复制代码子组件：
    <template>
    <div class="child">
        // 具名插槽
        <slot name="up"></slot>
        <h3>这里是子组件</h3>
        // 具名插槽
        <slot name="down"></slot>
        // 匿名插槽
        <slot></slot>
    </div>
    </template>

```

父组件通过html模板上的slot属性关联具名插槽。没有slot属性的html模板默认关联匿名插槽。


    (3)作用域插槽|带数据插槽，在slot上面绑定数据:../components/slot3/Slot3

    父组件：
    ``` js
        <template>
        <div class="father">
            <h3>这里是父组件</h3>
            <!--第一次使用：用flex展示数据-->
            <child>
            <template slot-scope="user">
                <div class="tmpl">
                <span v-for="item in user.data">{{item}}</span>
                </div>
            </template>

            </child>

            <!--第二次使用：用列表展示数据-->
            <child>
            <template slot-scope="user">
                <ul>
                <li v-for="item in user.data">{{item}}</li>
                </ul>
            </template>

            </child>

            <!--第三次使用：直接显示数据-->
            <child>
            <template slot-scope="user">
            {{user.data}}
            </template>

            </child>

            <!--第四次使用：不使用其提供的数据, 作用域插槽退变成匿名插槽-->
            <child>
            我就是模板
            </child>
        </div>
        </template>
    ``` 
    子组件：
    ``` js
        <template>
        <div class="child">

            <h3>这里是子组件</h3>
            // 作用域插槽
            <slot  :data="data"></slot>
        </div>
        </template>

        export default {
            data: function(){
            return {
                data: ['zhangsan','lisi','wanwu','zhaoliu','tianqi','xiaoba']
            }
            }
        }
    ```
    

