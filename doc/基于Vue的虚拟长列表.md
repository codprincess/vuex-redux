#### 基于Vue的虚拟长列表

#### 思路

##### 滑动窗口

为什么说是滑动窗口呢？在本地，我们保存着一个超长的数据列表，但没有必要将他们全部加入到视图中，用户只需要也只能看到当前视口范围内显示的数据，既然这样，咱们就可以用一个容器存放当前用户需要看到的数据，然后将这个容器中的数据展示给用户，可以将这个容器看成是一个小窗口，当用户发出要查看更多数据的请求时，移动这个小窗口，然后更新视图。

假如刚好是视口的高度，当向下移动窗口的时候，需要将窗口最上方的Item去掉，因为用户不需要看到了，然后把下一个数据push到窗口最下方，那么窗口移动很快的时候，更新的频率也会非常快
假如将窗口再放大一些，就能减小上面的更新频率，相当于节流，这取决于窗口大小

看一下原理图：
![image](https://github.com/codprincess/vuex-redux/blob/master/img/list.png)

具体的做法就是，如果一页展示10条数据，那么实际上我会渲染20条，并且将这20条数据划分为2部分，当可视区移动到容器的边缘时

如果可视区的上边缘碰到容器的上边缘，用前半部分Item填充后半部分Item，然后在原始数据中往前拿10条数据填充到前半部分，再将容器的位置上移10个Item高度
和上面的情况刚好相反

容器的DOM结构像这样

<div ref="fragment" class="fragment" :style="{ transform: `translate3d(0, ${translateY}px, 0)` }">
    <template v-for="item in currentViewList">
        <div :key="item.key">
        <!-- item content -->
        </div>
    </template>
</div>

```js
// 原始数据
const sourceList = [/* ... */]

// 状态1
const currentViewList = [...sourceList.slice(20, 30), ...sourceList.slice(30, 40)]

// 状态1 向下
currentViewList = [...sourceList.slice(30, 40), ...sourceList.slice(40, 50)]

// 状态1 向上
currentViewList = [...sourceList.slice(10, 20), ...sourceList.slice(20, 30)]

```
这里使用translate平移，因为这可以减少不必要的layout，在这个实现中，移动容器是一个非常频繁的操作，所以非常有必要考虑layout消耗

##### 滚动事件
1、滚动不一定是连续的，比如快速拖动滚动条

2、滚动事件在每一帧绘制前执行，自带节流效果，并且和每一帧是“同步”的，只需要保证回调逻辑足够简单快捷，尽量不去触发回流操作，就能保证不会影响原有的平滑滚动的效果

##### 滚动条
对滚动行为的要求决定了得使用原生滚动，其实也很简单，由于还需要实现上拉加载功能，我们在底部肯定需要放一个loading，这样的话，就可以给loading设置一个paddingTop值，大小为Item的高度乘以列表长度 ，这样一来滚动条就是真实的滚动条了

<div ref="fragment" class="fragment" :style="{ transform: `translate3d(0, ${translateY}px, 0)` }">
  <!---->
</div>
<div class="footer" :style="{ paddingTop: `${loadingTop}px` }">
  <div class="footer-loading">Loading......</div>
</div>

##### 用不用key
那么对于容器内的Item，根据vdom diff算法的特性：

1、设置key的情况下，其中一半在更新时只需要调换位置，另外一半会被移除，然后会新增一半的DOM，如果我手动快速拖动滚动条，那可能所有DOM都要被删除然后重新创建。

2、不设置key的情况下，20个Item都不会被删除，在这种情况下快速拖动滚动条，就不需要重新创建DOM了，但每个Item每次都会被就地复用，缺点就是原本可以只进行移动的节点也被就地复用了

##### 临界点判断

这里的方式有很多种，可以在滚动事件中通过getBoundingClientRect获取到容器相对视口的位置后计算。这里有的朋友可能会有疑问，getBoundingClientRect方法不是会触发回流吗？你在滚动事件中频繁调用这个方法，那对性能不是非常不利吗？来看2个小例子：
```js
// 例1
setInterval(() => {
  console.log(document.body.offsetHeight)
}, 100)

// 例2
let height = 1000
setInterval(() => {
  document.body.style.height = `${height++}px`
  console.log(document.body.offsetHeight)
}, 100)
```

显然这里的例1不会导致回流，但例2就会了，原因是因为你在当前帧更新了layout相关的属性，同时设置后又进行了一次查询，这就导致浏览器必须进行layout得到正确的值后返回给你。所以，关于我们平常所说的那些导致layout的属性，不是用了就会layout，而是看你如何用。

那么临界点的逻辑大概是这样的：
```js
const innerHeight = window.innerHeight
const { top, bottom } = fragment.getBoundingClientRect()

if (bottom <= innerHeight) {
  // 到达最后一个Item，向下
}

if (top >= 0) {
  // 到达第一个Item，向上
}
```
注意在页面滚动时，这里并不会频繁触发向上或者向下的逻辑。以向下为例，当触发向下的逻辑后，立即将容器的translateY值更新（相当于下移10个Item高度）向下平移，同时更新Item，下一帧渲染后容器下边缘已经回到可视区下方了，然后继续向下滚动一段距离后才会再次触发，这其实就像一个懒加载，只不过这是同步的。

##### 滚动方向

只有在向下滚动时，才有必要执行向下的逻辑，向上滚动同理。为了处理不同方向的逻辑，需要算出当前的滚动方向，这个直接保存上一次的值就能搞定了
```js
let oldTop = 0
const scrollCallback = () => {
  const scrollTop = getScrollTop(scroller)
  
  if (scrollTop > oldTop) {
    // 向下
  } else {
    // 向上
  }
    
  oldTop = scrollTop
}
```

#### 实现步骤

##### 懒加载
处理滚动条时，咱们已经添加了loading标签，这里只需要在滚动事件中判断这个loading元素是否出现在可视区，一旦出现就触发加载逻辑。这里有一个边界情况要考虑，一旦触发了加载逻辑，不出意外在拿到响应数据时是要更新原始数据的，如果此时，我停留在底部，需要自动将新的数据渲染出来；如果我在没有拿到数据前，向上滚动了，那么拿到响应后就不需要将新的数据更新到视图了。
```js
const loadCallback = () => {
  if (this.finished) {
    // 没有数据了
    return
  }
  
  const { y } = loadGuard.getBoundingClientRect()
  
  if (y <= innerHeight) {
    if (this.loading) {
      // 不能重复加载
      return
    }
    this.loading = true
    
    // 执行异步请求
  }
}

```
##### 向下滚动
首先，需要做一些相关的边界处理，比如currentViewList中的数据量不满足向下滚动等。主要还是要注意一点：滚动不一定是连续的
```js
    down (scrollTop, y) {
      const { size, currentViewList } = this
      const currentLength = currentViewList.length

      if (currentLength < size) {
        // 数据不足以滚动
        return
      }

      const { sourceList } = this

      if (currentLength === size) {
        // 单独处理第二页
        this.currentViewList.push(...sourceList.slice(size, size * 2))
        return
      }

      const length = sourceList.length
      const lastKey = currentViewList[currentLength - 1].key

      // 已经是当前最后一页了，但可能正在加载新的数据
      if (lastKey >= length - 1) {
        return
      }

      let startPoint
      const { pageHeight } = this

      if (y < 0) {
        // 直接拖动滚动条，导致容器底部边缘直接出现在可视区上方，这种情况通过列表高度算出当前位置
        const page = (scrollTop - scrollTop % pageHeight) / pageHeight + (scrollTop % pageHeight === 0 ? 0 : 1) - 1
        startPoint = Math.min(page * size, length - size * 2)
      } else {
        // 连续的向下滚动
        startPoint = currentViewList[size].key
      }
      this.currentViewList = sourceList.slice(startPoint, startPoint + size * 2)
    }

```
##### 向上滚动
向上滚动的处理和向下滚动类似
```js
    up (scrollTop, y) {
      const { size, currentViewList } = this
      const currentLength = currentViewList.length

      if (currentLength < size) {
        return
      }

      const firstKey = currentViewList[0].key

      if (firstKey === 0) {
        return
      }

      let startPoint
      const { sourceList, innerHeight, pageHeight } = this

      if (y > innerHeight) {
        const page = (scrollTop - scrollTop % pageHeight) / pageHeight + (scrollTop % pageHeight === 0 ? 0 : 1) - 1
        startPoint = Math.max(page * size, 0)
      } else {
        startPoint = currentViewList[0].key - size
      }
      this.currentViewList = sourceList.slice(startPoint, startPoint + size * 2)
    },

```

### 总结
1、思路：滑动窗口、滚动事件、滚动条、用不用key、临界点判断、滚动方向
2、实现：懒加载、向上滑动、向下滑动