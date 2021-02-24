<template>
  <main>
    <base-layout :title="$t('recover.whats-your-email')" :description="$t('recover.enter-email')" expanded>
      <form @submit.prevent="generateResetPasswordLink">
        <b-field>
          <b-input
            v-model="email.value"
            icon="email"
            type="email"
            :placeholder="$t('email')"
            :validation-message="$t('error.email.format')"
            :maxlength="email.maxlength"
          />
        </b-field>
        <b-field>
          <b-button type="is-primary" expanded :loading="sendButtonLoading" @click="generateResetPasswordLink">{{
            $t('recover.send-email')
          }}</b-button>
        </b-field>
        <b-message type="is-warning" has-icon icon-size="is-medium">
          <em>{{ $t('note') }}</em
          >: {{ $t('confirm-email.previous') }}
        </b-message>
      </form>
    </base-layout>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BNotificationConfig } from 'buefy/types/components';
import BaseLayout from '@/components/BaseLayout.vue';
import { parseGqlError } from '@/common/gql-response-validators';
import isEmail from 'validator/es/lib/isEmail';
import { FIELD_LENGTH } from '@xbeat/toolkit';

@Component({ components: { BaseLayout } })
export default class ForgetPassword extends Vue {
  title = () => this.$t('forgot-password');
  email = {
    value: '',
    maxlength: FIELD_LENGTH.EMAIL.MAX
  };
  sendButtonLoading = false;

  async generateResetPasswordLink() {
    if (!this.email.value) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    if (!isEmail(this.email.value, { allow_ip_domain: false })) {
      return;
    }
    this.sendButtonLoading = true;
    try {
      await this.$apollo.mutate({
        mutation: require('../graphql/GenerateResetPasswordToken.gql'),
        variables: {
          resetPassword: {
            email: this.email.value,
            lang: this.$i18n.locale
          }
        }
      });
      this.sendButtonLoading = false;
      this.$buefy.notification.open({
        type: 'is-success',
        position: 'is-bottom-right',
        duration: 7000,
        message: this.$t('recover.email-sent', [this.email.value]) as string
      });
      this.$router.push(`/${this.$i18n.locale}/signin`);
    } catch (e) {
      this.sendButtonLoading = false;
      const notificationOpts: BNotificationConfig = {
        message: '',
        type: 'is-danger',
        position: 'is-bottom-right',
        duration: 7000
      };
      const { statusCode } = parseGqlError(e);

      if (statusCode === 404) {
        this.$buefy.notification.open({
          ...notificationOpts,
          message: this.$t('recover.email-not-found', [this.email.value]) as string
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/variables.less';

main {
  form {
    max-width: @form-width;
    margin: 0 auto;
  }
}
</style>
