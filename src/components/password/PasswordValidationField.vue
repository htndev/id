<template>
  <div class="password">
    <b-field :type="fieldStyle">
      <b-input
        v-model="password"
        type="password"
        icon-clickable
        icon="lock"
        password-reveal
        :disabled="disabled"
        tabindex="4"
        :placeholder="$t('password.title')"
        @focus="onFocus"
      ></b-input>
    </b-field>
    <div class="rules" :class="[isInitialState && 'initial-state']">
      <password-rule v-for="(rule, i) in rules" :key="i" :text="rule.message" :valid="rule.valid" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { LocaleMessage } from 'vue-i18n';
import PasswordRule from '@/components/password/PasswordRule.vue';
import { FIELD_LENGTH } from '@/common/constants';

type Rules =
  | 'password.should.include-lowercase-letter'
  | 'password.should.include-capital-letter'
  | 'password.should.include-digit'
  | 'password.should.include-special-symbol'
  | 'password.should.be-minimum-length';
type Validator = { message: LocaleMessage; validator: (value: string) => boolean; valid: boolean; rule: Rules };

@Component({ components: { PasswordRule } })
export default class PasswordValidationField extends Vue {
  @Prop({ default: '', type: String })
  value!: string;
  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  passwordLength = FIELD_LENGTH.PASSWORD;
  password = this.value;
  isInitialState = true;
  isValidRules = {
    'password.should.include-lowercase-letter': false,
    'password.should.include-capital-letter': false,
    'password.should.include-digit': false,
    'password.should.include-special-symbol': false,
    'password.should.be-minimum-length': false
  };

  get rules(): Validator[] {
    return [
      {
        rule: 'password.should.include-lowercase-letter',
        message: this.errorMessages['password.should.include-lowercase-letter'],
        validator: (value: string) => /[a-z]+/.test(value),
        valid: this.isValidRules['password.should.include-lowercase-letter']
      },
      {
        rule: 'password.should.include-capital-letter',
        message: this.errorMessages['password.should.include-capital-letter'],
        validator: (value: string) => /[A-Z]+/.test(value),
        valid: this.isValidRules['password.should.include-capital-letter']
      },
      {
        rule: 'password.should.include-digit',
        message: this.errorMessages['password.should.include-digit'],
        validator: (value: string) => /[0-9]+/.test(value),
        valid: this.isValidRules['password.should.include-digit']
      },
      {
        rule: 'password.should.include-special-symbol',
        message: this.errorMessages['password.should.include-special-symbol'],
        validator: (value: string) => /[ -/:-@[-`{-~]+/.test(value),
        valid: this.isValidRules['password.should.include-special-symbol']
      },
      {
        rule: 'password.should.be-minimum-length',
        message: this.errorMessages['password.should.be-minimum-length'],
        validator: (value: string) => value.length > FIELD_LENGTH.PASSWORD.MIN,
        valid: this.isValidRules['password.should.be-minimum-length']
      }
    ];
  }

  get errorMessages() {
    return {
      'password.should.include-lowercase-letter': this.$tc('password.should.include-lowercase-letter', 1, [1]),
      'password.should.include-capital-letter': this.$tc('password.should.include-capital-letter', 1, [1]),
      'password.should.include-digit': this.$tc('password.should.include-digit', 1, [1]),
      'password.should.include-special-symbol': this.$tc('password.should.include-special-symbol', 1, [1]),
      'password.should.be-minimum-length': this.$t('password.should.be-minimum-length', [FIELD_LENGTH.PASSWORD.MIN])
    };
  }

  get fieldStyle(): string {
    return this.isInitialState ? '' : this.isPasswordValid ? 'is-success' : 'is-danger';
  }

  get isPasswordValid(): boolean {
    return this.rules.every(({ valid }) => valid);
  }

  @Watch('password')
  validateInput(value: string) {
    this.password = value;
    this.rules.forEach(({ message, validator, rule }) => {
      this.isValidRules[rule] = validator(this.password);
    });
    this.$emit('input', this.password);
    this.$emit('update:validity', this.isPasswordValid);
  }

  onFocus() {
    if (this.isInitialState) {
      this.isInitialState = false;
    }
  }
}
</script>

<style lang="less" scoped>
.password {
  .rules {
    transition: 0.15s opacity ease-in;
    &.initial-state {
      opacity: 0;
    }
    p {
      font-size: 12px;
    }
  }
}
</style>
