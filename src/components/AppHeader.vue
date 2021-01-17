<template>
  <header class="container is-fluid pt-5">
    <b-navbar>
      <template #brand>
        <b-navbar-item tag="a" :href="homepageUrl" tabindex="-1">
          <logo medium />
        </b-navbar-item>
      </template>
      <template #end>
        <slot name="button">
          <b-navbar-item tag="div" class="is-flex">
            <spacer />
            <b-dropdown :triggers="['hover']" aria-role="list" scrollable>
              <template #trigger>
                <b-button :label="currentLocale" type="is-outlined" icon-right="menu-down" />
              </template>
              <b-dropdown-item v-for="locale in supportedLanguages" :key="locale.value" @click="switchLocale(locale)">
                {{ locale.title }}
              </b-dropdown-item>
            </b-dropdown>
            <b-button :to="buttonLink" tag="router-link" type="is-primary is-outlined" tabindex="1" class="ml-3">
              {{ buttonText }}
            </b-button>
          </b-navbar-item>
        </slot>
      </template>
      <template #burger>
        <template v-if="showMobileHeaderButton">
          <spacer />
          <b-dropdown :triggers="['hover']" aria-role="list" scrollable>
            <b-dropdown-item v-for="locale in supportedLanguages" :key="locale.value">
              {{ i18n.title }}
            </b-dropdown-item>
          </b-dropdown>
          <b-button :to="buttonLink" tag="router-link" type="is-primary is-outlined" tabindex="1">
            {{ buttonText }}
          </b-button>
        </template>
      </template>
    </b-navbar>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Logo from '@/components/Logo.vue';
import Spacer from '@/components/common/Spacer.vue';
import { CLIENTS, Language } from '@/common/constants';

type Pages = 'signin' | 'signup';
enum Page {
  SignIn = 'signin',
  SignUp = 'signup'
}
type LanguageKey = keyof typeof Language;

const OPPOSITE_PAGES: { [k in Pages]: string } = {
  [Page.SignIn]: 'signup',
  [Page.SignUp]: 'signin'
};
const PAGE_I18N = {
  signin: 'sign-in',
  signup: 'sign-up'
};

@Component({
  components: { Logo, Spacer }
})
export default class AppHeader extends Vue {
  homepageUrl = CLIENTS.homepage;
  screenWidth = window.screen.availWidth;

  get getAlterPage(): Pages {
    return OPPOSITE_PAGES[this.$route.meta.path as Pages] as Pages;
  }

  get buttonText() {
    return this.$t(PAGE_I18N[this.getAlterPage]) ? this.$t(PAGE_I18N[this.getAlterPage]) : this.$t('sign-up');
  }

  get buttonLink(): string {
    return this.getAlterPage || Page.SignUp;
  }

  get currentLocale(): Language {
    const lang = this.$i18n.locale.toUpperCase() as LanguageKey;
    return Language[lang];
  }

  get supportedLanguages() {
    return this.$i18n.availableLocales
      .filter(locale => locale !== this.$i18n.locale)
      .map(locale => ({
        title: Language[locale.toUpperCase() as LanguageKey],
        value: locale
      }));
  }

  get showMobileHeaderButton() {
    return this.screenWidth < 1024;
  }

  created() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.screen.availWidth;
    });
  }

  switchLocale({ value }: { value: string }) {
    this.$i18n.locale = value;
    this.$router.push({
      params: {
        locale: this.$i18n.locale
      }
    });
  }
}
</script>
