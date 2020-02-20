#### 基于vue的长列表处理
#### 懒渲染
懒渲染就是大家平常说的无限滚动，指的就是在滚动到页面底部的时候，再去加载剩余的数据。这是一种前后端共同优化的方式，后端一次加载比较少的数据可以节省流量，前端首次渲染更少的数据速度会更快。这种优化要求产品方必须接受这种形式的列表，否则就无法使用这种方式优化。

实现的思路非常简单：监听父元素的 scroll 事件（一般是 window），通过父元素的 scrollTop 判断是否到了页面是否到了页面底部，如果到了页面底部，就加载更多的数据。


首先如何对数据量大的列表进行滚动加载优化呢？主要原因就是页面上元素太多滚动的时候会有卡段问题，移动端更为显著

那么就是如何减少页面元素

有以下问题需要解决
###### 1、 什么时候开始删除元素，什么时候把删了的元素显示回来？
###### 2、被删了的元素会导致高度减少，怎么保持高度不变？
###### 3、如何确保列表元素显示在应该出现 的位置？
###### 4、什么时候开始加载新数据？

列表的每个item的高度要一致

above: 当前显示列表的上方，一般高度为screen高度的2倍
screen: 我们可以理解为屏幕或者是显示列表的容器，我们主要是需要通过它来计算出当前screen里可以显示多少个item
below: 当前屏幕下方

###### 1、保持总高度不变
首先，我们是要删除元素的，为了保持总高度的不变，我们把ul这个元素的高度设置为所有item加起来的总高度，此时列表的screen就是类名为content的div元素，也就是说整个ul列表是在content的这个div里面滚动。

那么问题来了，如何保持ul的总高度不变，方法挺多的
（1）对ul设置总高度，然后显示item进行相对定位；
（2）在列表的开始和结尾各放一个元素来撑开高度
（3）使用padding或者margin来撑开顶部高度
###### 2、删除和显示元素
为了方便计算，我们只以顶部为计算目标，好处是我们不需要管底部是什么情况，一切以顶部为准，进行元素的删除和显示
```js
if (this.lastScrollTop === null || Math.abs(_scrollTop - this.lastScrollTop) > this._max) {
    this.lastScrollTop = _scrollTop;
} else {
    return;
}
```
根据之前的定义，这里主要判断当screen（div.content）的scrollTop减去上一次的ScrollTop会大于最高度_max(_max = screen的item数*item的高度)的时候，就会开始重组列表数据，也就是无论向下还是向上滚动，只要满足```Math.abs(_scrollTop - this.lastScrollTop) > this._max```,都要重组列表数据，那么应该取数据的那一部分为新的列表数据？

###### 3、生成新数据
基于item的告诉不变的条件。其实可以很容易计算出当前列表的上方有多少个item，在页面的元素上应该要有4*screen的item数，也即是```above+below+rowsInWindow```

那么可以通过div.centent的scrollTop来计算应该从列表数据第几个开始截取，也就是超出了above高度的item数，然后它的长度就是```above+below+rowsInWindow```

```js
let _from = parseInt(_scrollTop / this.height) - this._above;
if (_from < 0) {
    _from = 0;
}
let _to = _from + this._above + this._below + this._rowsInWindow;
if (_to > this.list.length) {
    _to = this.list.length;
}
```
计算出了from和to后，就可以获取新的列表数据了。
```js
this.previewList = [];
for (; from < to; from++) {
    this.previewList.push(this.list[from])
}
```
那么这里，我特意用了一个独立的数组previewList来保存要显示的列表数据，这样做主要是为了保证总列表数据的不变。新的数据生成之后，剩下的事情就交给vue去做了。

##### 4、加载新的数据

这里其实就是最简单的一步了。当列表被拉到最底下的时候，总的列表数据其实已经没有了。那么这个时候有2种情况下应该触发加载新的数据的方法。第一个就是to已经是数据长度的最大值，和在第二步的判断里retrun之前并且页面已经滚到了最底下。

然后在这个时机触发加载更多数据的方法，那么加载了新的数据，form和to必须要重新计算，因为此时的below已经没有任何元素了。重置了from和to之后，再生成新的previewList列表，然后就完成了。
```js
loadmore(from, to) {
  ...
  // fetch mock
  setTimeout(() => {
    for(var i = 0; i < 200; i++) {
      this.list.push({
        title: 'item ' + COUNT++
      });
    }
    let _from = from, _to = to + this._below; // 重新计算，这里还要处理加载回来的数据比below要求的还少的情况
    this.resetPreviewList(_from, _to); // 重新计算previewList
    ...
  }, 2000)
}
```
