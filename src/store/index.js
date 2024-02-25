import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bookingList: [],
    datesRange: [],
  },
  getters: {
    bookingList: (state) => {
      return state.bookingList;
    },
    datesRange: (state) => {
      return state.datesRange;
    },
  },
  mutations: {
    setBookingList: (state, payload) => {
      state.bookingList = payload;
    },
    setDatesRange: (state, payload) => {
      state.datesRange = payload;
    },
  },
  actions: {},
});
