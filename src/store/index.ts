import Vue from 'vue';
import Vuex from 'vuex';

import { UserState } from './modules/user';

Vue.use(Vuex);

interface RootState {
  user: UserState;
}

export default new Vuex.Store<RootState>({});
