const state = {
  logged: false
};

const getters = {
  logged: state => state.logged,
};

const mutations = {
  setLogged(state, logged) {
    state.logged=logged;
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
