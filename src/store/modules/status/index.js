const state = {
  logged: false,
  expiredFlag: false
};

const getters = {
  logged: state => state.logged,
  expiredFlag: state => state.expiredFlag,
};

const mutations = {
  setLogged(state, logged) {
    state.logged=logged;
  },
  setExpiredFlag(state, expiredFlag) {
    state.expiredFlag=expiredFlag;
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
