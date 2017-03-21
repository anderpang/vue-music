import Vue from 'vue'
import App from './App.vue'
import "./extend/utils.js"
import Ext from './extend'
import {Router,router} from './router'

Vue.use(Ext)
Vue.use(Router)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
