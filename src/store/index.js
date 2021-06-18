import Vue from 'vue'
import Vuex from 'vuex'
import product from "./products/product";
import user from "./users/user";
import order from "./orders/order";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    product,
    user,
    order
  }
});

export default store;
