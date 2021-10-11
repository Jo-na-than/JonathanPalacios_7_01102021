<template>
    <div class="text-center">
        <error v-if="error" :error ="error" class="mx-auto text-center my-5 col col-md-5 col-lg-4 col-xl-4" />

        <!-- formulaire pour forgot password -->
        <form class="mx-auto text-center my-5 col col-md-8 col-lg-6 col-xl-4" @submit.prevent = "handleSubmit">
            <h3 class="pink my-5">
                Forgot password
            </h3>

            <!-- input email -->
            <div class="form-floating">
                <input id="email" required type="email" class="form-control" placeholder="Email" v-model="email">
                <label for="email" class="form-group">Email</label>
            </div>

            <button class="btn btn-primary my-3">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios'
import Error from './Error'
import Swal from 'sweetalert2'

export default {
    name: 'Forgot',
    components: {
        Error
    },
    data() {
        return { 
            email:"",
            error:""
        }
    },
    methods: {
        // method pour envoyer email au server (pour demander 1 token et reset password...)
        async handleSubmit() {
            try{
                await axios.post('api/auth/forgot', { email: this.email })
                    .then( (response) => {console.log(response);
                    Swal.fire("Email envoyé, veuillez suivre les instructions!")
                    
                    })
                    .catch( (err) => {
                        console.log(err);
                        this.error = "Email non trouvé, veuillez réessayer"
                        })
            }
            catch (e) { console.log(e); this.error = "Email non trouvé, veuillez réessayer!!!"}
        }
    }
}

</script>