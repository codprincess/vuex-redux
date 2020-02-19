<template>
    <div class="vue-list" @scroll="handleScroll">
        <ul :style="{
      paddingTop: lineTopHeight +'px',
      paddingBottom: lineBottomHeight +'px'
    }">
            <li v-for="(item ,index) in previewList" :key="index">{{item.title}}</li>
        </ul>
        <div class="load-more-gif">loading....</div>
    </div>
</template>
<script>
export default {
    name:'vue-list',
    props: {
    list: {
      type: Array,
      required: true,
      default: () => [],
      twoWays: true
    },
    height: {
      type: Number,
      default: 44
    },
    canScroll: {
      type: Boolean,
      default: true
    },
    dispatchData: {
      type: Function
    }
  },
    data(){
        return{
            lastScrollTop:null,
            distance:44,
            lineTopHeight:0,
            lineBottomHeight:0,
            canLoadmore:true,
            previewList:[],
            displayCount:0,
            count:1
        }
    },
    mounted() {
        this.initData();
        this.handleScroll();
    },
    methods: {
        initData(){
            this._rowsInWindow = Math.ceil(this.$el.offsetHeight/this.height),
            this._above = this._rowsInWindow*2,
            this._below = this._rowsInWindow,
            this._max = this._rowsInWindow*this.height
            console.log(this._max);

        },
        handleScroll(){
            let _scrollTop = this.$el.scrollTop;
           let  _height = this.$el.querySelectorAll('ul')[0].offsetHeight;
           let  _contentHeight = this.$el.offsetHeight;
           //console.log(_scrollTop);
           //计算当前屏幕上的行数
           if(_scrollTop/this.height - Math.floor(_scrollTop/this.height)>0.5){
               this.displayCount = Math.ceil(_scrollTop/this.height);
           }else{
               this.displayCount = Math.floor(_scrollTop/this.height);
           }

          //如果超过最大高度，则重置浏览列表,删除和显示元素
          if(this.lastScrollTop === null || Math.abs(_scrollTop - this.lastScrollTop)>this._max){
              this.lastScrollTop = _scrollTop;
          }else{
              if(this.to === this.list.length&&_height-_scrollTop-_contentHeight<this.distance){
                  this.canScroll&&this.loadmore(this.from,this.to)
              }
              return;
          }

          //开始截取数据

          let _from = parseInt(_scrollTop/this.height) - this._above;
          if(_from<0){
              _from = 0;
          }

        let _to = _from + this._above + this._below + this._rowsInWindow;
        if (_to > this.list.length) {
            _to = this.list.length;
        }
        this.from = _from;
        this.to = _to;

        //

        this.lineTopHeight = _from*this.height;
        this.lineBottomHeight = (this.list.length - _to)*this.height;

        //
        if(typeof this.dispatchData === 'function'){
            this.dispatchData(this)
        }

        //
        this.resetPreviewList(_from,_to);
        //
        this.$nextTick(()=>{
            let _scrollTop = this.$el.scrollTop;
            let  _height = this.$el.querySelectorAll('ul')[0].offsetHeight;
            let  _contentHeight = this.$el.offsetHeight;
            if(_to === this.list.length && _height - _scrollTop - _contentHeight<0){
                this.canScroll && this.loadmore(this.from,this.to);
            }

        });

        },

    //加载新数据
        loadmore(from,to){
            if(!this.canLoadmore) return;
            this.canLoadmore = false;
            //请求数据
            setTimeout(()=>{
                for(var i = 0;i<200;i++){
                    this.list.push({
                        title:'item'+this.count++
                    })
                }
                //重新计算，这里还要处理加载回来的数据比below要求的还少的情况
                let _from = from, _to = to + this._below;
                // 重新计算previewList
                this.resetPreviewList(_from, _to);
                this.lineBottomHeight = (this.list.length - _to) * this.height;
                this.handleScroll();
                this.canLoadmore = true;
            },200)
        },
        //计算出了from和to后，就可以获取新的列表数据了。
        resetPreviewList(from,to){
            //重置列表
            this.previewList = [];
            for(;from<to;from++){
                this.previewList.push(this.list[from])
            }
        }
    },
}
</script>
<style scoped>
    .vue-list{
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    .vue-list::scroll-bar{
        width: 0;
    }
    ul{
        margin: 0;
        padding: 0;
    }
    li{
        text-decoration:none;
        height: 44px;
        font-size: 14px;
        line-height: 3;
        text-align: left;
        padding-left: 15px;
        border-bottom: 1px solid #dddddd;
        box-sizing: border-box;
        background: #ffffff;

    }
    .load-more-gif{
        width: 100%;
        height: 44px;
        text-align: 44px;
        background: #ffffff;
        border-top: none;
        color: #48B884;
    }
</style>