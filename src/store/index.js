import Vue from 'vue'
import Vuex from 'vuex'

import snackbar from "./modules/snackbar";
import status from "./modules/status";
import filters from "./modules/filters";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    snackbar,
    status,
    filters
  }
})
