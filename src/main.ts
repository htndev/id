import Vue from 'vue';
import Buefy from 'buefy';

import { createProvider } from './apollo';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';

import './assets/scss/app.scss';
import './plugins/axios';
import './registerServiceWorker';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app');
