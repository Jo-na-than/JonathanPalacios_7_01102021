<template>
    <div class="container-fluid">
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark">

                <button class="navbar-toggle" type = "button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls = "navbarContent" aria-expanded="false" aria-label = "Toggle navigation">
                </button>

                <div id="navbarContent" class="collapse navbar-collapse navbar-collapse-sm col  mx-auto text-center font-weight-bolder justify-self-center dropdown-menu-lg-right justify-content-between text-light">
                    <div class=" ">
                        <router-link to="/" class="color">ACCUEIL</router-link>
                    </div>
                    <div class=" collape navbar-collapse ">

                        <!-- si user n'est pas connecté -->
                        <ul v-if="!user.user" class="navbar-nav ml-auto">
                            <li class="nav-item px-5 ">
                                <router-link to="/login" class="color">Connexion</router-link>
                            </li>
                            <li class="nav-item px-5">
                                <router-link to="/signup" class="color">S'Inscrire</router-link>
                            </li>
                        </ul>

                        <!-- si user est connecté -->
                        <ul v-if="user.user" class="navbar-nav m-auto">
                            <li class="nav-item px-4">
                                <router-link to="/user" class="color">Profil</router-link>
                            </li>
                            <li class="nav-item px-4">
                                <router-link to="/help" class="color">FAQ</router-link>
                            </li>
                            
                            <li class="nav-item px-4">
                                <a href= "javascript:void(0)" class="color" @click = "handleClick">Déconnexion</a>
                            </li>
                        </ul>

                    </div>
                </div>

        </nav>

    </div>
</template>
    
<script>
import { mapState } from 'vuex'
import axios from '../axios'
export default {
    name: "Navbar",

    methods: {
        // method pour logout, supprimer tous dans localStorage et store

        async handleClick (){
            await axios.post ('/api/auth/logout', {}, { withCredentials: true })
                .then(response=> {
                    console.log(response)
                    localStorage.removeItem('token');
                    localStorage.removeItem('id');
                    this.$store.dispatch('user/setCurrentUser', null)
                    this.$router.push('/')      //revenir à Home
                })
                .catch( err => {console.log(err)})
            
        }
    },

    computed: {
      ...mapState ( { user: state => state.user} )
    }
}
</script>

<style scoped>
    .color {
        color: #69ACF6 !important
    }
    .color:hover,
    .color:focus {
        opacity: 0.5;
        color: #0000FF !important;
        background: white;
    }
</style>