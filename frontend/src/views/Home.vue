<template>
    <div class="container">
        <!-- Si user est connecté -->
      <div v-if="user.user">
          <div class="">
            <Logo class="text-left  my-5"/>

          </div>
          <div>
            <h4 class="pink" >Bonjour {{user.user.userNom}} </h4>
            <AllPost/>
          </div>
            
      </div>
        <!-- Si user n'est pas connecté, l'inviter à se connecter -->
      <div v-else class="text-center my-5 mx-auto text-danger">
          <Logo class="my-5"/>
          <h1 class="red my-5 ">Bienvenue sur le réseau Groupomania, connectez - vous pour commencer </h1>
      </div>

      
    </div>
</template>

<script>

import { mapState } from 'vuex'
import Logo from '../components/Logo'
import AllPost from '../components/AllPost'
export default {
    name: "Home",
    components: {
        AllPost,
        Logo
    },
  
    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>

<style scoped>
  .red {
    color: #C3081A !important;
  }
</style>