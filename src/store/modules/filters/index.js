const state = {
  movements: {},
  items: {},
  tickets: {},
  operations: {},

  movementsFlag: false,
  itemsFlag: false,
  ticketsFlag: false,
  operationsFlag: false,
};

const getters = {
  movementsFilter: state => state.movements,
  itemsFilter: state => state.items,
  ticketsFilter: state => state.tickets,
  operationsFilter: state => state.operations,

  movementsFlag: state => state.movementsFlag,
  itemsFlag: state => state.itemsFlag,
  ticketsFlag: state => state.ticketsFlag,
  operationsFlag: state => state.operationsFlag,
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
  setOperationsFilter(state, sel) {
    state.operations = sel;
  },
  
  setMovementsFlag(state, sel) {
    state.movementsFlag = sel;
  },
  setItemsFlag(state, sel) {
    state.itemsFlag = sel;
  },
  setTicketsFlag(state, sel) {
    state.ticketsFlag = sel;
  },
  setOperationsFlag(state, sel) {
    state.operationsFlag = sel;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
