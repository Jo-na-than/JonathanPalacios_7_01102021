<template >
  <div id="app" class="container">
      <Navbar />
      <router-view ></router-view>

      <Footer/>
  </div>
</template>>

<script>
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import axiosInstance from './axios';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },

  data() {
      return {
        id: localStorage.getItem('id'),
        currentUserId:localStorage.getItem('id')
      }   
    },
    // récupérer le user login et enregistrer dans store de vuex
    async created() {
      await axiosInstance.get(`api/auth/${this.id}`)
        .then( response => {
          console.log("nom" + response.data.currentUser.userNom)
          console.log("currentuser" + response.data.currentUser);
          this.$store.dispatch ('user/setCurrentUser', response.data.currentUser)
          
        })
        .catch(error => console.log(error));
    },
}; 
</script>
<style>
    text-right {
      text-align: right!important;
    }
    #app{
      background: #E4E6E9;
      background-size: cover;
      min-height: 100vh;
    }
    .pink {
    color: #CF033C !important;
    font-weight:900;
  }
    
    .btn-primary {
      background: #0000FF !important;
      color: white !important
    }
    .btn-primary:hover,
    .btn-primary:focus {
      background: #0000A0 !important;
      opacity: 0.7
    }
    .dropdown-item:hover,
    .dropdown-item:focus,
    .form-control-file:hover,
    .form-control-file:focus {
      background: #0000FF !important ;
      color: white !important;
    }
    .btn-secondary:hover,
    .btn-secondary:focus {
      background: #0000FF !important
    }
    .mini {
        padding: 0.5rem !important;
        margin:0 !important
      }
    @media screen and (max-width: 400px) {
      .hidden {
        display: none;
      }
      .mini {
        padding: 0.5rem !important;
        margin:0 !important
      }
    }
    
</style>