<template>
    <div>
        <header>
            <h1 class="title">Vue处理长列表</h1>
        </header>
        <div class="content">
            <div class="preview">
                <div class="preview-content">
                    <vue-list :list.sync='list' :dispatchData="setData"></vue-list>
                </div>
            </div>
            <div class="setting">
                <h3>页面滚动详情</h3>
                <p>Total items：<span>{{list.length}}</span></p>
                <p>items height：<span>{{data.height}}</span></p>
                <p>above items：<span>{{data._above}}</span></p>
                <p>below items：<span>{{data.below}}</span></p>
                <p>Rows in window：<span>{{data.displayCount + 1}}-{{(data.displayCount + data._rowsInWindow) > list.length ? list.length: (data.displayCount + data._rowsInWindow)}}</span></p>
                <p>：<span>{{data._rowsInWindow * 4}}</span> items from <span>{{data.from}}</span> to <span>{{data.to}}</span></p>
                <p>Top height：<span>{{data.lineTopHeight}}px</span></p>
                <p>Bottom height：<span>{{data.lineBottomHeight}}px</span></p>
                <p>will load more items：<span>{{!data.canLoadmore}}</span></p>
            </div>
        </div>
    </div>
</template>
<script>
import vueList from '../components/vue-list';
export default {
    data(){
        return{
            count:1,
            list:[],
            data:{}
        }
    },
    created() {
        for(var i = 0;i<200;i++){
            this.list.push({
                title:'item'+ this.count++
            })
        }

        console.log(this.list)
    },
    methods: {
        setData(data){
            this.data = data;
            console.log('data',this.data)
        }
    },
    components:{
        vueList
    }
}
</script>
<style scoped>
    header{
        width: 100%;
        padding: 30px 0;
        margin-bottom: 20px;
    }
    .title{
        font-size: 46px;
        line-height: 20px;
        color: #48B884;
    }
    p{
        color: #7f8c8d
    }
    .content{
        display: flex;
        width: 800px;
        height: 650px;
        margin:0 auto;
    }
    .content >div{
        flex: 1;
        height: 100%
    }
    .preview{
        position: relative;
        background-size: 324px 642px;
        border: 1px solid #cccccc;
    }
    .preview-content{
        
        width: 256px;
        height: 464px;
        position: absolute;
        left: 72px;
        top: 91px;
        background: #ffffff;
        /* overflow-y: scroll; */
    }
    .setting span{
        color: #48B884;
    }
</style>