import Vue from 'vue';
import router from './router/router.js';
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import './style/common.css';
import './style/main.less'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app')
