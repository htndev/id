<template>
  <main>
    <base-layout :title="$t('greeting')" :description="$t('sign-up-description')">
      <form @submit.prevent="signUp">
        <b-field :type="emailFieldType" :message="emailErrorMessage">
          <b-input
            icon-clickable
            v-model="email.value"
            type="text"
            icon="email"
            tabindex="2"
            :placeholder="$t('email')"
            :maxlength="email.length.MAX"
            :loading="email.loading"
            :disabled="email.disabled"
            @focus="onEmailFocus"
            @blur="onEmailBlur"
          />
        </b-field>
        <b-tooltip
          multilined
          position="is-right"
          class="pb-3"
          :active="username.focus"
          :label="$t('hint.username.format')"
        >
          <b-field :type="usernameFieldType" :message="usernameErrorMessage">
            <b-input
              icon-clickable
              v-model="username.value"
              type="text"
              icon="account"
              tabindex="3"
              :placeholder="$t('username')"
              :maxlength="username.length.MAX"
              :disabled="email.disabled"
              @focus="onUsernameFocus"
              @blur="onUsernameBlur"
            />
          </b-field>
        </b-tooltip>
        <password-validation-field
          v-model="password.value"
          :disabled="password.disabled"
          @update:validity="updatePasswordValidity"
        />
        <b-field class="mt-3">
          <b-button
            expanded
            type="is-primary"
            tabindex="5"
            :disabled="!isReadyForSignUp"
            :loading="signUpButton.loading"
            @click="signUp"
          >
            {{ $t('sign-up') }}
          </b-button>
        </b-field>
      </form>
    </base-layout>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import { BNotificationConfig } from 'buefy/types/components';
import BaseLayout from '@/components/BaseLayout.vue';
import PasswordValidationField from '@/components/password/PasswordValidationField.vue';
import { AllowedRedirectProps, FIELD_LENGTH } from '@/common/constants';
import { GraphqlResponse } from '@/common/types';
import { API } from '@/common/api';
import isEmail from 'validator/es/lib/isEmail';
import { usernameRegexp } from '@/common/regex';
import { isAuthorized, parseGqlError } from '@/common/gql-response-validators';

type ValidatorFunction = (str: string, options: any) => boolean;
type AsyncValidatorFunction = (str: string, options: any) => Promise<boolean>;

type Validator = { validator: ValidatorFunction | AsyncValidatorFunction; options?: any; message: string };

type Validation = Validator | Validator[];

type Field = 'email' | 'username';

@Component({
  components: { BaseLayout, PasswordValidationField }
})
export default class SignUp extends Vue {
  title = () => this.$t('sign-up');
  email = {
    value: '',
    message: '',
    valid: false,
    length: FIELD_LENGTH.EMAIL,
    loading: false,
    focus: false,
    disabled: false
  };

  username = {
    value: '',
    message: '',
    valid: false,
    length: FIELD_LENGTH.USERNAME,
    loading: false,
    focus: false,
    disabled: false
  };

  password = {
    value: '',
    valid: false,
    disabled: false
  };

  signUpButton = {
    loading: false
  };

  private validator = {
    notEmpty: (str: string) => str.length > 0,
    lt: (length: number) => (str: string) => str.length < length
  };

  get emailFieldType(): string {
    return this.getFieldType('email');
  }

  get usernameFieldType(): string {
    return this.getFieldType('username');
  }

  get emailErrorMessage(): LocaleMessage {
    return this.getErrorMessage('email');
  }

  get usernameErrorMessage(): LocaleMessage {
    return this.getErrorMessage('username');
  }

  get isReadyForSignUp(): boolean {
    return this.email.valid && this.username.valid && this.password.valid;
  }

  private getFieldType(field: Field) {
    return this[field].valid && !this[field].focus ? 'is-success' : this[field].message ? 'is-danger' : '';
  }

  private getErrorMessage(field: Field): LocaleMessage {
    return this[field].message ? this.$t(this[field].message) : '';
  }

  private throwError = (message: string) => {
    throw new Error(message);
  };

  private validate = (validation: Validation) => async (str: string) => {
    if (!Array.isArray(validation)) {
      if (!validation.validator(str, validation.options)) {
        this.throwError(validation.message);
      }
    }
    for (const validator of validation as Validator[]) {
      const isValid = await validator.validator(str, validator.options);

      if (!isValid) {
        this.throwError(validator.message);
      }
    }
  };

  private checkExistence = (entity: Field) => async (str: string) => {
    this[entity].loading = true;
    const {
      data: {
        userExists: { exists }
      }
    } = await this.$apollo.query<{ userExists: { exists: boolean } }>({
      query: require('../graphql/UserExists.gql'),
      variables: {
        search: {
          [entity]: str
        }
      }
    });
    this[entity].loading = false;

    return !exists;
  };

  async validateField(value: string, validation: Validation): Promise<{ isValid: boolean; message?: string }> {
    const validator = await this.validate(validation);

    try {
      await validator(value);

      return { isValid: true };
    } catch ({ message }) {
      return { isValid: false, message };
    }
  }

  private onFocus(field: Field) {
    this[field].valid = true;
    this[field].focus = true;
    this[field].message = '';
  }

  onEmailFocus() {
    this.onFocus('email');
  }

  onUsernameFocus() {
    this.onFocus('username');
  }

  async onEmailBlur() {
    this.email.focus = false;
    const { isValid, message } = await this.validateField(this.email.value, [
      { validator: this.validator.notEmpty, message: 'error.email.empty' },
      { validator: this.validator.lt(FIELD_LENGTH.EMAIL.MAX), message: 'error.email.too-long' },
      // eslint-disable-next-line @typescript-eslint/camelcase
      { validator: isEmail, message: 'error.email.format', options: { allow_ip_domain: false } },
      { validator: this.checkExistence('email'), message: 'error.email.user-exists' }
    ]);

    if (!isValid) {
      this.email.valid = false;
      this.email.message = message as string;
      return;
    }
  }

  async onUsernameBlur() {
    this.username.focus = false;

    const { isValid, message } = await this.validateField(this.username.value, [
      { validator: this.validator.notEmpty, message: 'error.username.empty' },
      { validator: this.validator.lt(this.username.length.MAX), message: 'error.username.too-long' },
      { validator: (str: string) => usernameRegexp().test(str), message: 'error.username.format' },
      { validator: this.checkExistence('username'), message: 'error.username.user-exists' }
    ]);

    if (!isValid) {
      this.username.valid = false;
      this.username.message = message as string;
    }
  }

  updatePasswordValidity(isValid: boolean) {
    this.password.valid = isValid;
  }

  private toggleFieldsDisable(disabled: boolean) {
    this.email.disabled = this.username.disabled = this.password.disabled = disabled;
  }

  private toggleSignUpButton(value: boolean) {
    this.signUpButton.loading = value;
  }

  private triggerFieldExistanceError(field: 'email' | 'username', message?: string) {
    this[field].valid = false;
    const errorMessage = message ?? `error.${field}.user-exists`;
    this[field].message = this.$t(errorMessage) as string;
  }

  async signUp() {
    if (!this.isReadyForSignUp) {
      return;
    }

    this.toggleFieldsDisable(true);
    this.signUpButton.loading = true;

    const [isUsernameAvailable, isEmailAvailable] = await Promise.all([
      this.checkExistence('username')(this.username.value),
      this.checkExistence('email')(this.email.value)
    ]);

    if (!isUsernameAvailable) {
      this.email.message = this.$t('error.email.user-exists') as string;
      this.email.valid = false;
    }

    if (!isEmailAvailable) {
      this.username.message = this.$t('error.username.user-exists') as string;
      this.username.valid = false;
    }

    if (!isUsernameAvailable || !isEmailAvailable) {
      this.toggleFieldsDisable(false);
      this.signUpButton.loading = false;
      return;
    }

    try {
      const { ip } = await API.getIp();
      await this.$apollo.mutate<GraphqlResponse<'signUp'>>({
        mutation: require('../graphql/SignUp.gql'),
        variables: {
          user: {
            email: this.email.value,
            username: this.username.value,
            password: this.password.value,
            ip,
            lang: this.$i18n.locale
          }
        }
      });

      this.$buefy.notification.open({
        type: 'is-success',
        message: this.$t('signup-successful') as string,
        duration: 7000
      });
      this.$router.push(`/${this.$i18n.locale}/signin`);
    } catch (e) {
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
        default: {
          const { message } = parseGqlError(e);

          return this.$buefy.notification.open({
            ...notificationOpts,
            message: message
          });
        }
      }
    } finally {
      this.toggleFieldsDisable(false);
      this.toggleSignUpButton(false);
    }
  }
}
</script>

<style lang="less" scoped>
main {
  .b-tooltip {
    width: 100%;
  }
}
</style>
