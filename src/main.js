import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./filters"
import vuetify from './plugins/vuetify';
import abilitiesPlugin from "./plugins/abilitiesPlugin";
import FlagIcon from 'vue-flag-icon'
import VueConfirmDialog from "vue-confirm-dialog";
import i18n from "./i18n";

Vue.config.productionTip = false


Vue.use(abilitiesPlugin);

Vue.use(FlagIcon);

Vue.use(VueConfirmDialog);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);

import { ValidationProvider, ValidationObserver } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

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
