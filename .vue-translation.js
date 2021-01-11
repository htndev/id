/* eslint-disable */
const path = require('path');
const { JSONAdapter } = require('vue-translation-manager');
/* eslint-enable */

module.exports = {
  srcPath: path.join(__dirname, 'src/'),
  adapter: new JSONAdapter({
    path: path.join(__dirname, 'src/i18n/locales/')
  }),
  languages: ['de', 'en', 'ru', 'ua']
};
