import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../home/index.vue'
import trading from '../view/trading/trading.vue'

Vue.use(VueRouter);

const routes = [
    {
        path:'/',
        component:home
    },
    {
        path:"/trading",
        component:trading
    }
]

const router = new VueRouter({
    routes:routes
})

export default router;