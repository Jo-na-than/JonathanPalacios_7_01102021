export const post = ({
    namespaced: true,
    state: { 
        posts: {},
    }
,
    getter: {
        getAllPosts: (state) => { return state.posts},
    },
    mutations: {
        // pour tous les user
        AllPosts(state, posts) {
            state.posts = posts;
          },
        
    },
    actions: {
        // enregistrer tous les posts de tous les utilisateurs
        async getAllPosts (context, posts) {
            context.commit('AllPosts', posts)
        },
    }
  })