
export const user = ({
    namespaced: true,
    state: null
,
    getter: {
        getCurrentUser: (state) => { return state.user}
    },
    mutations: {
        currentUser ( state, user ) { 
            state.user = user
        }
    },
    actions: {
        async setCurrentUser (context, user) { 
            context.commit('currentUser', user)
        }
    }
  })