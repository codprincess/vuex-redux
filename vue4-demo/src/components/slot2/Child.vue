<template>
    <div class="child">
        <slot name="up"></slot>
        <h3>这个是子组件</h3>
        <slot name="down"></slot>
        <slot></slot>
    </div>
</template>
<script>
export default {
    data(){
        return{
            mag:''
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