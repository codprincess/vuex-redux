<template>
    <div class="father">
        <h3>这个是父组件</h3>
        <!--第一次使用flex展示数据-->
        <child>
            <template slot-scope="user">
                <div class="tmpl">
                    <span v-for="(item ,index) in user.data" :key="index">{{item}}</span>
                </div>
            </template>
        </child>

        <!--第二次使用列表展示数据-->
        <child>
            <template slot-scope="user">
                <ul>
                    <li v-for="(item,index2) in user.data" :key="index2">{{item}}</li>
                </ul>
            </template>
        </child>

        <!--第三次直接显示数据-->
        <child>
            <template slot-scope="user">
                {{user.data}}
            </template>
        </child>
        <!--第十次使用，不使用其提供的数据--->
        <child>
            我就是模板
        </child>
    </div>
</template>
<script>
import Child from './Child'
export default {
    data(){
        return{
            mag:''
        }
    },
    created() {
        // this.clickHandler(data);
    },
    methods: {
    //     clickHandler(data){
    //       console.log(data);
    //   }
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
    width: 40%;
    margin: 0 auto;
  }
  .tmpl span{
    border:1px solid red;
    height:50px;
    line-height: 50px;
    /* padding: 10px; */
  }
</style>