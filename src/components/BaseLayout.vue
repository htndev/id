<template>
  <main class="container is-fluid mt-5">
    <b-navbar>
      <template #brand>
        <b-navbar-item tag="a" :href="homepageUrl">
          <logo medium />
        </b-navbar-item>
      </template>
      <template #end>
        <slot name="button">
          <b-navbar-item tag="div" class="is-flex">
            <spacer />
            <b-button :to="buttonLink" tag="router-link" type="is-primary is-outlined" tabindex="1">
              {{ buttonText }}
            </b-button>
          </b-navbar-item>
        </slot>
      </template>
      <template #burger>
        <template v-if="showMobileHeaderButton">
          <spacer />
          <b-button :to="buttonLink" tag="router-link" type="is-primary is-outlined" tabindex="1">
            {{ buttonText }}
          </b-button>
        </template>
      </template>
    </b-navbar>
    <div class="columns is-flex is-justify-content-center">
      <div class="column wrapper">
        <h1 class="is-size-1 has-text-weight-bold has-text-centered">{{ title }}</h1>
        <h4 v-if="description" class="has-text-centered">{{ description }}</h4>
        <slot />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Logo from '@/components/Logo.vue';
import Spacer from '@/components/common/Spacer.vue';
import { CLIENTS } from '@/common/constants';

@Component({
  components: { Logo, Spacer }
})
export default class BaseLayout extends Vue {
  @Prop({ type: String, required: true })
  buttonText!: string;
  @Prop({ type: String, required: true })
  buttonLink!: string;
  @Prop({ type: String, required: true })
  title!: string;
  @Prop({ type: String })
  description?: string;

  homepageUrl = CLIENTS.HOMEPAGE;
  screenWidth = window.screen.availWidth;

  get showMobileHeaderButton() {
    return this.screenWidth < 1024;
  }

  created() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.screen.availWidth;
    });
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/colors.less';

main.container {
  .wrapper {
    max-width: 280px;
    font-family: 'Graphik', Arial, Helvetica, sans-serif;

    h1 {
      color: @black;
    }
    h4 {
      color: @gray;
      margin-bottom: 30px;
    }
  }

  /deep/ .navbar .navbar-brand {
    display: flex;
    align-items: center;
  }
}
</style>
