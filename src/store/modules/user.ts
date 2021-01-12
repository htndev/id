import store from '@/store';
import { Module, VuexModule } from 'vuex-module-decorators';

export interface UserState {
  user: null | Record<string, any>;
}

@Module({ dynamic: true, store, namespaced: true, name: 'user' })
export class UserModule extends VuexModule {
  user = null;
}
