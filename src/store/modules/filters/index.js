const state = {
  movements: {},
  items: {},
  orders: {},
  tickets: {},

  movementsFlag: false,
  itemsFlag: false,
  ordersFlag: false,
  ticketsFlag: false
};

const getters = {
  movementsFilter: state => state.movements,
  itemsFilter: state => state.items,
  ordersFilter: state => state.orders,
  ticketsFilter: state => state.tickets,

  movementsFlag: state => state.movementsFlag,
  itemsFlag: state => state.itemsFlag,
  ordersFlag: state => state.ordersFlag,
  ticketsFlag: state => state.ticketsFlag
};

const mutations = {
  setMovementsFilter(state, sel) {
    state.movements = sel;
  },
  setItemsFilter(state, sel) {
    state.items = sel;
  },
  setOrdersFilter(state, sel) {
    state.orders = sel;
  },
  setTicketsFilter(state, sel) {
    state.tickets = sel;
  },
  
  setMovementsFlag(state, sel) {
    state.movementsFlag = sel;
  },
  setItemsFlag(state, sel) {
    state.itemsFlag = sel;
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
