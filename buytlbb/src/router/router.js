import Vue from 'vue';
import VueRouter from 'vue-router';
import home from '../home/index.vue'
import trading from '../view/trading/trading.vue'
import buy from '../components/HelloWorld'
import help from '../view/help/help.vue'

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
    },
    {
        path:"/help",
        component:help
    }
]

const router = new VueRouter({
    routes:routes
})

export default router;