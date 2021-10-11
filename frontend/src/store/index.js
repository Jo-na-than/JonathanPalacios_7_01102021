import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import  {user}    from './user'
import  {post}    from './post'


export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    post
  },
  plugins: [createPersistedState()]
})
