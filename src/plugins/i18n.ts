import { REDIRECT_QUERY_PARAM } from './../common/constants';
import { ALLOWED_PATH } from '@/common/constants';
import { Route } from 'vue-router';
import i18n from '@/i18n';

export const I18N = {
  get currentLocale() {
    return i18n.locale;
  },
  set currentLocale(locale: string) {
    i18n.locale = locale;
  },
  get supportedLocales(): string[] {
    return i18n.availableLocales;
  },
  get fallbackLocale(): string {
    return i18n.fallbackLocale as string;
  },
  isSupportedLocale: (locale: string) => I18N.supportedLocales.includes(locale),
  beforeEnter: ({ params: { locale }, meta: { path } }: Route, _: Route, next: Function) => {
    if (I18N.isSupportedLocale(locale) && Object.values(ALLOWED_PATH).includes(path)) {
      I18N.currentLocale = locale;
      next();
      return;
    } else if (I18N.isSupportedLocale(locale)) {
      i18n.locale = locale;
      next(`${I18N.currentLocale}/${ALLOWED_PATH.SIGN_IN}`);
      return;
    }

    const _path = `/${I18N.fallbackLocale}/${ALLOWED_PATH.SIGN_IN}`;

    next(_path);
  },
  toDefaultRoute() {
    return `${I18N.fallbackLocale}/${ALLOWED_PATH.SIGN_IN}`;
  }
};
