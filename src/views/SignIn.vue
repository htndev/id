<template>
  <main>
    <base-layout
      :button-text="buttonText"
      :button-link="buttonLink"
      :title="sectionTitle"
      :description="sectionDescription"
    >
      <form>
        <b-input v-model="email"></b-input>
        <b-input v-model="password"></b-input>
      </form>
    </base-layout>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BaseLayout from '@/components/BaseLayout.vue';

@Component({
  components: { BaseLayout }
})
export default class SignIn extends Vue {
  buttonText = this.$t('sign-up');
  buttonLink = '/signup';
  sectionTitle = this.$t('sign-in');
  sectionDescription = 'Join us';

  email = '';
  password = '';
}
</script>
