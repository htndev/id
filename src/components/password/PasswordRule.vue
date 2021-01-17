<template>
  <div class="rule" :class="{ valid }">
    <b-icon :icon="getRuleIcon" size="is-small" />
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';

@Component
export default class PasswordRule extends Vue {
  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: Boolean, required: true })
  valid!: boolean;

  get getRuleIcon() {
    return this.valid ? 'check-circle' : 'close-circle';
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/colors.less';

.rule {
  display: flex;
  align-items: center;
  color: @error;
  transition: 0.15s color ease-in-out;
  &:not(:last-child) {
    padding-bottom: 0.3rem;
  }
  &.valid {
    color: @success;
  }
  .icon {
    width: 13px;
    min-width: 13px;
    margin-right: 5px;
  }
  p {
    font-size: 12px;
  }
}
</style>
