/* eslint-disable no-new */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';
import VueSocketio from 'vue-socket.io';

import App from './App.vue';
import config from './config';

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueSocketio, `${process.env.HOST}:${process.env.PORT}`);

config(Vue);

new Vue({
  el: '#app',
  render: h => h(App),
});
