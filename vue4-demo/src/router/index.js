//设置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {path:'/slot1',component:()=>import("../components/slot1/Slot1")},
    {path:'/slot2',component:()=>import("../components/slot2/Slot2")},
    { path: '/slot3', component: () => import("../components/slot3/Slot3") },
    {path:'/list',component:()=>import("../views/List")}
]

const router = new VueRouter({
    mode:'history',
    routes
})

export default router