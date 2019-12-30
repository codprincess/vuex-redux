## Vue生命周期的理解

vue的生命周期总共可以分为8个阶段:

beforeCreate(创建前)<br/>
created(创建后)

beforeMount(载入前)

mounted(载入后)

beforeUpdate(更新前)

updated(更新后)

beforeDestroy(销毁前)

destroyed(销毁后)

总的来说就是创建=>挂载=>更新=>销毁

参照官网给的流程图:
![image](https://github.com/codprincess/vuex-redux/blob/master/img/lifecycle.png)

我们首先需要创建一个Vue实例,也就是在 new Vue ( ) 的对象过程当中，首先执行了init（init是vue组件里面默认去执行的），在init的过程当中首先调用了beforeCreate，然后在injections（注射）和reactivity（反应性）的时候，它会再去调用created。所以在init的时候，事件已经调用了，我们在beforeCreate的时候千万不要去修改data里面赋值的数据，最早也要放在created里面去做（添加一些行为）。

当created完成之后，它会去判断instance（实例）里面是否含有“el”option（选项），如果没有的话，它会调用vm.$mount(el)这个方法，然后执行下一步；如果有的话，直接执行下一步。紧接着会判断是否含有“template”这个选项，如果有的话，它会把template解析成一个render function.
我们在 .vue 文件中写的 template 都经过了 vue-loader 处理，直接变成了 render 函数，放在vue-loader 解析过的文件中；这样做的好处，把 template 解析成 render 函数，比较耗时，vue-loader处理后，我们在页面上执行代码时，效率会变高。

beforeMount在有了render function的时候才会执行，当执行完render function之后，就会调用mounted这个钩子，在mounted挂载完毕之后，这个实例就算是走完流程了。

后续的钩子函数执行的过程都是需要外部的触发才会执行。比如说有数据的变化，会调用beforeUpdate，然后经过Virtual DOM，最后updated更新完毕。当组件被销毁的时候，它会调用beforeDestory，以及destoryed。
```js
     beforeCreate(){
    //创建之前无法获取相应数据
    console.log("beforeCreate","data:"+this.msg,"el:"+this.$el)
    //beforeCreate data:undefined el:undefined
  },

  created(){
    //创建之后
    console.log("created","data:"+this.msg,"el:"+this.$el);
    //created data:Vue的生命周期 el:undefined
  },

  beforeMount(){
    //挂载前
    console.log("beforeMount","data:"+this.msg,"el:"+this.$el)
    //beforeMount data:Vue的生命周期 el:[object HTMLDivElement]
  },
  mounted(){
    //挂载后
    console.log("mounted","data:"+this.msg,"el:"+this.$el)
    //mounted data:改变msg的值 el:[object HTMLDivElement]
  },
  beforeUpdate(){
      // 数据更新之前
      console.log("beforeUpdate","data:"+this.msg,"el:"+this.$el);
      //beforeUpdate data:改变msg的值 el:[object HTMLDivElement]
  },

  updated(){
      // 数据更新完成之后；
      console.log("updated","data:"+this.msg,"el:"+this.$el);
      //beforeUpdate data:Vue的生命周期1 el:[object HTMLDivElement]
  },

   beforeDestroy(){
        // 销毁之前
        console.log("beforeDestroy","data:"+this.msg,"el:"+this.$el);
    },
    destroyed(){
        // 销毁之后
        console.log("destroyed","data:"+this.msg,"el:"+this.$el);
    }

```
从console中的结果中,我们看出:

在beforeCreate生命周期执行的时候，data和methods中的数据都还没有初始化。不能在这个阶段使用data中的数据和methods中的方法.

create：data 和 methods都已经被初始化好了，如果要调用 methods 中的方法，或者操作 data 中的数据，最早可以在这个阶段中操作.

beforeMount：执行到这个钩子的时候，在内存中已经编译好了模板了，但是还没有挂载到页面中，此时，页面还是旧的

mounted：执行到这个钩子的时候，就表示Vue实例已经初始化完成了。此时组件脱离了创建阶段，进入到了运行阶段。 如果我们想要通过插件操作页面上的DOM节点，最早可以在和这个阶段中进行

beforeUpdate： 当执行这个钩子时，页面中的显示的数据还是旧的，data中的数据是更新后的， 页面还没有和最新的数据保持同步

updated：页面显示的数据和data中的数据已经保持同步了，都是最新的

beforeDestory：Vue实例从运行阶段进入到了销毁阶段，这个时候上所有的 data 和 methods ， 指令， 过滤器 ……都是处于可用状态。还没有真正被销毁

destroyed： 这个时候上所有的 data 和 methods ， 指令， 过滤器 ……都是处于不可用状态。组件已经被销毁了。

第一次加载页面会触发哪些钩子:beforeCreate， created， beforeMount， mounted
