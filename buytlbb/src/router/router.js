import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../home/index.vue'
import trading from '../view/trading/trading.vue'
import buy from '../components/HelloWorld'

Vue.use(VueRouter);

const routes = [
    {
        path:'/',
        component:home
    },
    {
        path:"/trading",
        component:trading
    },
    {
        path:"/buy",
        component:buy
    }
]

const router = new VueRouter({
    routes:routes
})

export default router;