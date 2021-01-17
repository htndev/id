<template>
  <main>
    <base-layout :title="$t('sign-in')" :description="$t('sign-in-description')">
      <form @submit.prevent="signIn">
        <b-field :type="emailFieldType" :message="emailErrorMessage">
          <b-input
            v-model="email.value"
            tabindex="2"
            :placeholder="$t('email')"
            :maxlength="email.maxLength"
            @focus="onFocus('email')"
            @blur="onBlur('email')"
          />
        </b-field>
        <b-field :type="passwordFieldType" :message="passwordErrorMessage">
          <b-input
            v-model="password.value"
            type="password"
            password-reveal
            tabindex="3"
            :placeholder="$t('password.title')"
            :maxlength="password.maxLength"
            @focus="onFocus('password')"
            @blur="onBlur('password')"
          />
        </b-field>
        <b-field>
          <b-button expanded type="is-primary" tabindex="4" :loading="signInButton.loading" @click="signIn">
            {{ $t('sign-in') }}
          </b-button>
        </b-field>
        <p class="has-text-centered">
          <router-link to="forgot-password">{{ $t('recover.forgot-password') }}</router-link>
        </p>
        <p class="has-text-centered">
          {{ $t('new-at-xbeat') }} <router-link to="signup">{{ $t('create-account') }}</router-link>
        </p>
      </form>
    </base-layout>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import BaseLayout from '@/components/BaseLayout.vue';
import { AllowedRedirectProps, FIELD_LENGTH, HttpStatus } from '@/common/constants';
import { API } from '@/common/api';
import { isAuthorized, isWrongEmailOrPassword } from '@/common/gql-response-validators';
import { GraphqlResponse } from '@/common/types';
import { BNotificationConfig } from 'buefy/types/components';

type Field = 'email' | 'password';
const validator = (str: string) => str.length > 0;

@Component({
  components: { BaseLayout }
})
export default class SignIn extends Vue {
  title = () => this.$t('sign-in');

  email = {
    value: '',
    initialState: true,
    valid: false,
    focus: false,
    disabled: false,
    message: '',
    errorMessage: 'error.email.empty',
    maxLength: FIELD_LENGTH.EMAIL.MAX
  };

  password = {
    value: '',
    initialState: true,
    valid: false,
    focus: false,
    disabled: false,
    message: '',
    errorMessage: 'error.password.empty',
    maxLength: FIELD_LENGTH.PASSWORD.MAX
  };

  signInButton = {
    loading: false
  };

  get emailErrorMessage(): LocaleMessage {
    return this.getErrorMessage('email');
  }

  get passwordErrorMessage(): LocaleMessage {
    return this.getErrorMessage('password');
  }

  get emailFieldType(): string {
    return this.getFieldType('email');
  }

  get passwordFieldType(): string {
    return this.getFieldType('password');
  }

  get isReadyForSignIn(): boolean {
    return this.email.valid && this.password.valid;
  }

  private getErrorMessage(field: Field): LocaleMessage {
    return this[field].message ? this.$t(this[field].message) : '';
  }

  private getFieldType(field: Field) {
    return this[field].valid && !this[field].focus ? 'is-success' : this[field].message ? 'is-danger' : '';
  }

  validateField(field: Field) {
    if (this[field].initialState) {
      this[field].initialState = false;
    }
    const isValid = validator(this[field].value);
    [this[field].valid, this[field].message] = [isValid, isValid ? '' : (this[field].errorMessage as string)];
  }

  onFocus(field: Field) {
    if (this[field].initialState) {
      this[field].initialState = false;
    }
    this[field].message = '';
    this[field].focus = true;
  }

  onBlur(field: Field) {
    this[field].focus = false;

    this.validateField(field);
  }

  async signIn() {
    if (!this.isReadyForSignIn) {
      this.validateField('email');
      this.validateField('password');
      return;
    }

    this.signInButton.loading = true;

    try {
      const response = await this.$apollo.mutate<GraphqlResponse<'signIn'>>({
        mutation: require('../graphql/SignIn.gql'),
        variables: {
          user: {
            email: this.email.value,
            password: this.password.value
          }
        }
      });

      this.signInButton.loading = false;
      const { status, message = '' } = response.data?.signIn || {};

      this.$buefy.notification.open({
        type: 'is-success',
        message: this.$t('welcome') as string,
        duration: 5000,
        position: 'is-bottom-right'
      });
      API.redirectTo(this.$route.query.to as AllowedRedirectProps);
    } catch (e) {
      this.signInButton.loading = false;
      const notificationOpts: BNotificationConfig = {
        message: '',
        type: 'is-danger',
        position: 'is-bottom-right',
        duration: 7000
      };

      switch (true) {
        case isAuthorized(e):
          API.redirectTo(this.$route.query.to as AllowedRedirectProps);
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('error.user.authorized') as string
          });
        case isWrongEmailOrPassword(e):
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('error.user.wrongEmailOrPassword') as string
          });
        default:
          return this.$buefy.notification.open({
            ...notificationOpts,
            message: this.$t('error.unknown') as string
          });
      }
    }
  }
}
</script>
