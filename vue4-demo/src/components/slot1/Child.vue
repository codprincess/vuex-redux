<template>
    <div class="child">
        <h3>这个是子组件</h3>
        <slot></slot>
    </div>
</template>

<script>
export default {
    data(){
        return{
            msg:''
        }
    },
    computed: {
        
    },
    methods: {
        
    },
    components:{

    }
}
</script>

<style scoped>
    .child{
        background-color: #00bbff;
        width: 100%;
        box-sizing: border-box;
    }
</style>