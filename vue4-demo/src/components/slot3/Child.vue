<template>
    <div class="child">
        <h3>这里是子组件</h3>
        <slot :data="data"></slot>
    </div>
</template>
<script>
export default {
    data(){
        return{
            data:['臭猪','大傻逼','小王八蛋','肥猪','哼哼','张云飞是大傻逼','哭唧唧']
        }
    }
}
</script>

<style scoped>
  .child{
    background-color: #00bbff;
    width: 100%;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>