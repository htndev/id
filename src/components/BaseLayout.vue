<template>
  <section class="container pt-6">
    <div class="columns is-flex is-justify-content-center">
      <div class="column wrapper" :class="[expanded && 'expanded']">
        <h1 class="is-size-1 has-text-weight-bold has-text-centered">{{ title }}</h1>
        <h4 v-if="description" class="has-text-centered">{{ description }}</h4>
        <slot />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BaseLayout extends Vue {
  @Prop({ type: String, required: true })
  title!: string;
  @Prop({ type: String })
  description?: string;
  @Prop({ type: Boolean, default: false })
  expanded!: boolean;
}
</script>

<style lang="less" scoped>
@import '../assets/less/variables.less';

section.container {
  .wrapper {
    font-family: 'Graphik', Arial, Helvetica, sans-serif;

    &:not(.expanded) {
      max-width: @form-width;
    }

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
