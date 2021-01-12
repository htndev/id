<template>
  <figure class="logo" :class="[logoSize]">
    <img src="@/assets/images/svg/logo.svg" svg-inline alt />
  </figure>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

const PROP_TYPE = {
  default: false,
  type: Boolean
};

enum LogoSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large'
}

@Component
export default class Logo extends Vue {
  @Prop({
    type: String,
    validator: (size: LogoSize) => [LogoSize.Small, LogoSize.Medium, LogoSize.Large, LogoSize.ExtraLarge].includes(size)
  })
  size!: LogoSize;
  @Prop(PROP_TYPE)
  small!: boolean;
  @Prop(PROP_TYPE)
  medium!: boolean;
  @Prop(PROP_TYPE)
  large!: boolean;
  @Prop(PROP_TYPE)
  extraLarge!: boolean;

  get logoSize(): LogoSize {
    if (this.size) {
      return this.size;
    }
    const { size } =
      [
        { size: LogoSize.Small, isActive: this.small },
        { size: LogoSize.Medium, isActive: this.medium },
        { size: LogoSize.Large, isActive: this.large },
        { size: LogoSize.ExtraLarge, isActive: this.extraLarge }
      ].find((size: { size: LogoSize; isActive: boolean }) => size.isActive) || {};

    return size ?? LogoSize.Medium;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/colors.less';

@small: 30px;
@medium: 50px;
@large: 70px;
@extra-large: 100px;

.size(@size) {
  width: @size;
  height: @size;
}

.logo {
  &.small {
    .size(@small);
  }

  &.medium {
    .size(@medium);
  }

  &.large {
    .size(@large);
  }

  &.extra-large {
    .size(@extra-large);
  }

  svg {
    width: 100%;
    height: 100%;

    g {
      fill: @black;
    }
  }
}
</style>
