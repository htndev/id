import './assets/scss/app.scss';
import './plugins/axios';
import './registerServiceWorker';
import 'buefy/dist/buefy.css';
import TitleMixin from '@/common/mixin/title';

import Buefy from 'buefy';
import Vue from 'vue';

import { createProvider } from '@/apollo';
import App from '@/App.vue';
import i18n from '@/i18n';
import router from '@/router';
import store from '@/store';

Vue.use(Buefy);
Vue.mixin(TitleMixin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app');
