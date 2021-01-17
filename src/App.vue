<template>
  <div id="app">
    <app-header />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AppHeader from '@/components/AppHeader.vue';
import { API } from '@/common/api';
import { AllowedRedirectProps } from './common/constants';

@Component({
  components: { AppHeader }
})
export default class App extends Vue {
  async beforeCreate() {
    const isAuthorized = await API.isAuthorized();

    if (isAuthorized) {
      API.redirectTo(this.$route.query.to as AllowedRedirectProps);
      return;
    }
  }
}
</script>

<style lang="less">
@import './assets/less/main.less';
</style>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
