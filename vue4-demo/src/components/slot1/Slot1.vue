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
<script>
import Child from './Child'
export default {
    data(){
        return{
            msg:''
        }
    },
    components:{
        'child':Child
    }
}
</script>
<style scoped>
   .father{
    width:100%;
    background-color: #ccc;
    height: 650px;
  }
  .tmpl{
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    width: 30%;
    margin: 0 auto;
  }
  .tmpl span{
    border:1px solid red;
    height:50px;
    line-height: 50px;
    padding: 10px;
  }
</style>
