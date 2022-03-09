const state = {
  users: {},
  customers: {},
  orders: {},
  tickets: {},

  usersFlag: false,
  customersFlag: false,
  ordersFlag: false,
  ticketsFlag: false
};

const getters = {
  usersFilter: state => state.users,
  customersFilter: state => state.customers,
  ordersFilter: state => state.orders,
  ticketsFilter: state => state.tickets,

  usersFlag: state => state.usersFlag,
  customersFlag: state => state.customersFlag,
  ordersFlag: state => state.ordersFlag,
  ticketsFlag: state => state.ticketsFlag
};

const mutations = {
  setUsersFilter(state, sel) {
    state.users = sel;
  },
  setCustomersFilter(state, sel) {
    state.customers = sel;
  },
  setOrdersFilter(state, sel) {
    state.orders = sel;
  },
  setTicketsFilter(state, sel) {
    state.tickets = sel;
  },
  
  setUsersFlag(state, sel) {
    state.usersFlag = sel;
  },
  setCustomersFlag(state, sel) {
    state.customersFlag = sel;
  },
  setOrdersFlag(state, sel) {
    state.ordersFlag = sel;
  },
  setTicketsFlag(state, sel) {
    state.ticketsFlag = sel;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
