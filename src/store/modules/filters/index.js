const state = {
  movements: {},
  items: {},
  tickets: {},

  movementsFlag: false,
  itemsFlag: false,
  ticketsFlag: false
};

const getters = {
  movementsFilter: state => state.movements,
  itemsFilter: state => state.items,
  ticketsFilter: state => state.tickets,

  movementsFlag: state => state.movementsFlag,
  itemsFlag: state => state.itemsFlag,
  ticketsFlag: state => state.ticketsFlag
};

const mutations = {
  setMovementsFilter(state, sel) {
    state.movements = sel;
  },
  setItemsFilter(state, sel) {
    state.items = sel;
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
