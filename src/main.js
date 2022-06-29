import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./filters"
import vuetify from './plugins/vuetify';
import abilitiesPlugin from "./plugins/abilitiesPlugin";
import FlagIcon from 'vue-flag-icon'
import i18n from "./i18n";
import VCalendar from 'v-calendar';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.config.productionTip = false

Vue.use(VuejsDialog);

Vue.use(abilitiesPlugin);

Vue.use(FlagIcon);

import { ValidationProvider, ValidationObserver } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.use(VCalendar, {
  componentPrefix: 'vc',
});

import { extend } from 'vee-validate';
extend('required', {
  message: field => i18n.t("vee.required",{field}),
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true
});


new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
