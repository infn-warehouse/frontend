const state = {
  appMode: null,
};

const getters = {
  appMode: state => state.appMode,
};

const mutations = {
  setAppMode(state, appMode) {
    state.appMode=appMode;
  },
};

const actions = {

};

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};
