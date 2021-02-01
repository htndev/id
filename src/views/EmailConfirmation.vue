<template>
  <main>
    <base-layout :title="$t('confirm-email.title')" expanded>
      <template>
        <b-loading v-if="isLoading"></b-loading>
        <div v-else-if="!isLoading && isTokenValid">
          <h3 class="has-text-centered pt-4 is-size-4 has-text-weight-medium">{{ $t('confirm-email.greeting') }}</h3>
          <p class="has-text-centered is-size-4">🎉🎉🎉🎉🎉🎉</p>
          <p class="has-text-centered pt-4">{{ $t('confirm-email.proceed') }}</p>
          <p class="has-text-centered pt-4">
            <b-button tag="router-link" :to="signInPath">{{ $t('sign-in') }}</b-button>
          </p>
        </div>
        <div v-else>
          <h3 class="has-text-centered pt-4">{{ errorMessage }}</h3>
          <p class="has-text-centered pt-4">
            <b-button tag="router-link" :to="signInPath">{{ $t('sign-in') }}</b-button>
          </p>
        </div>
      </template>
    </base-layout>
  </main>
</template>

<script lang="ts">
import { ALLOWED_PATH, HttpStatus } from '@/common/constants';
import { Vue, Component } from 'vue-property-decorator';
import BaseLayout from '@/components/BaseLayout.vue';

@Component({ components: { BaseLayout } })
export default class EmailConfirmation extends Vue {
  isTokenValid = false;
  isLoading = true;
  errorMessage = '';

  get signInPath(): string {
    return `/${this.$i18n.locale}/${ALLOWED_PATH.SIGN_IN}`;
  }

  async created() {
    try {
      await this.$apollo.mutate({
        mutation: require('../graphql/ConfirmEmail.gql'),
        variables: {
          token: this.$route.params.token
        }
      });

      this.isLoading = false;
      this.isTokenValid = true;
    } catch (e) {
      this.isLoading = false;
      const [
        {
          extensions: {
            exception: { status }
          }
        }
      ] = e.graphQLErrors;

      console.log(status);
      this.errorMessage = this.$t(
        status === HttpStatus.Conflict ? 'confirm-email.error.not-found' : 'error.unknown'
      ) as string;
      this.isTokenValid = false;
    }
  }
}
</script>
