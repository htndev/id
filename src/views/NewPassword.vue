<template>
  <main>
    <base-layout :title="$t('recover.title')" expanded>
      <b-loading v-model="isRequestPending"></b-loading>
      <template v-if="!isRequestPending && !isTokenValid">
        <p class="error has-text-centered is-size-4">
          {{ $t('recover.unknown') }}
        </p>
        <p class="has-text-centered is-size-4">
          <router-link :to="`/${$i18n.locale}/signin`">{{ $t('sign-in') }}</router-link>
        </p>
      </template>
      <form @submit.prevent="changePassword" v-else-if="!isRequestPending && isTokenValid">
        <password-validation-field
          v-model="password.value"
          :disabled="password.disabled"
          @update:validity="updatePasswordValidity"
        />

        <b-field class="pt-3" :message="passwordConfirmationMessage" :type="passwordConfirmationType">
          <b-input
            v-model="passwordConfirmation.value"
            type="password"
            icon="lock"
            tabindex="5"
            password-reveal
            :disabled="passwordConfirmation.disabled"
            :placeholder="$t('recover.new-password-confirmation')"
            @focus="onFocus"
            @blur="onBlur"
          />
        </b-field>
        <b-field class="pt-3">
          <b-button :loading="signInButtonLoading" type="is-primary" expanded @click="changePassword" tabindex="6">
            {{ $t('recover.change-password') }}
          </b-button>
        </b-field>
      </form>
    </base-layout>
  </main>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BaseLayout from '@/components/BaseLayout.vue';
import PasswordValidationField from '@/components/password/PasswordValidationField.vue';
import { BNotificationConfig } from 'buefy/types/components';
import { parseGqlError } from '@/common/gql-response-validators';

@Component({
  components: { BaseLayout, PasswordValidationField }
})
export default class NewPassword extends Vue {
  title = () => this.$t('recover.new-password');

  isRequestPending = true;
  isTokenValid = false;
  token = '';
  signInButtonLoading = false;

  password = {
    value: '',
    disabled: false,
    valid: false
  };

  passwordConfirmation = {
    value: '',
    disabled: false,
    valid: false,
    focus: false,
    initialState: true,
    message: '',
    errorMessage: 'error.password-confirmation.equal'
  };

  get passwordConfirmationMessage() {
    return this.passwordConfirmation.initialState
      ? ''
      : this.password.value === this.passwordConfirmation.value
      ? ''
      : this.$t(this.passwordConfirmation.errorMessage);
  }

  get passwordConfirmationType() {
    return this.passwordConfirmation.initialState
      ? ''
      : this.passwordConfirmation.value.length > 0 && this.passwordConfirmation.value === this.password.value
      ? 'is-success'
      : 'is-danger';
  }

  get isReadyForSubmit(): boolean {
    return this.password.valid && this.passwordConfirmation.valid;
  }

  updatePasswordValidity(isValid: boolean) {
    this.password.valid = isValid;
    this.passwordConfirmation.valid = isValid;
  }

  onFocus() {
    this.passwordConfirmation.focus = true;
    if (this.passwordConfirmation.initialState) {
      this.passwordConfirmation.initialState = false;
    }
  }

  onBlur() {
    this.passwordConfirmation.focus = false;

    this.passwordConfirmation.valid = this.passwordConfirmation.value === this.password.value;
    this.passwordConfirmation.message = this.passwordConfirmation.errorMessage;
  }

  async created() {
    const {
      data: {
        isTokenExists: { exists }
      }
    } = await this.$apollo.query<{ isTokenExists: { exists: boolean } }>({
      query: require('../graphql/IsTokenExists.gql'),
      variables: {
        token: this.$route.params.token
      }
    });
    this.isRequestPending = false;

    this.isTokenValid = exists;
    this.token = this.$route.params.token;
  }

  async changePassword() {
    if (!this.isReadyForSubmit) {
      return;
    }
    this.signInButtonLoading = true;

    try {
      await this.$apollo.mutate<{ resetPassword: { status: number } }>({
        mutation: require('../graphql/ResetPassword.gql'),
        variables: {
          resetPasswordInput: {
            token: this.token,
            password: this.password.value,
            passwordConfirmation: this.passwordConfirmation.value
          }
        }
      });
      this.signInButtonLoading = false;
      this.$buefy.notification.open({
        type: 'is-success',
        message: this.$t('recover.changed') as string,
        position: 'is-bottom-right',
        duration: 5000
      });
      this.$router.push(`/${this.$i18n.locale}/signin`);
    } catch (e) {
      this.signInButtonLoading = false;
      const notificationOpts: BNotificationConfig = {
        message: '',
        type: 'is-danger',
        position: 'is-bottom-right',
        duration: 7000
      };
      const { message } = parseGqlError(e);
      switch (message) {
        case 'Token not found. Not registered or expired': {
          this.isTokenValid = false;
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('recover.error.token-expired') as string
          });
        }
        case 'User not found': {
          this.isTokenValid = false;
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('recover.error.user-not-found') as string
          });
        }
        case 'New password should be different from the current password': {
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('recover.error.different-password') as string
          });
        }
        default: {
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('error.unknown') as string
          });
        }
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
    padding-top: 2rem;
  }
}
</style>
