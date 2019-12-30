<template>
  <div id="app">
     <input type="text" v-model="msg"><br>
      {{msg}}
     <hr>
   
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  // el:"#app",
  data(){
    return{
      msg:'Vue的生命周期'
    }
  },
  methods:{
     changeMsg(){
       this.msg = '改变msg的值'
     }
  },

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
    //beforeMount data:Vue的生命周期 el:undefined
  },
  mounted(){
    //挂载后
    console.log("mounted","data:"+this.msg,"el:"+this.$el)
    //mounted data:Vue的生命周期 el:[object HTMLDivElement]
  },
  beforeUpdate(){
      // 数据更新之前
      console.log("beforeUpdate","data:"+this.msg,"el:"+this.$el);
      //beforeUpdate data:改变msg的值 el:[object HTMLDivElement]
  },

  updated(){
      // 数据更新完成之后；
      console.log("updated","data:"+this.msg,"el:"+this.$el);
      //beforeUpdate data:改变msg的值 el:[object HTMLDivElement]
  },

   beforeDestroy(){
        // 销毁之前
        console.log("beforeDestroy","data:"+this.msg,"el:"+this.$el);
    },
    destroyed(){
        // 销毁之后
        console.log("destroyed","data:"+this.msg,"el:"+this.$el);
    }



}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
