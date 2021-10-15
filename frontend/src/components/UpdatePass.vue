<template>
    <div>
        <Logo class="my-3"/>
        
        <error class="text-center" v-if="error" :error = "error"/>

        <!-- Formulaire pour changer password -->
        <form @submit.prevent="changePass" class="form-group my-5 text-center col col-md-8 col-lg-6 col-xl-4 mx-auto">

        <h3 class="text-center my-5 mx-auto pink">Modifier votre password</h3>

            <!-- input password -->
            <div class="form-floating my-5">
                <input type="password" class="form-control col-sm-10" id="oldPass" name="oldPass" v-model="oldPass" placeholder="mot de passe" min="8" max="20">
                <label for="oldPass" class="form-group">mot de passe</label>
            </div>

            <!-- input nouveau password -->
            <div class="form-floating">
                <input type="password" class="form-control col-sm-10" id="newPass" name="newPass" v-model="newPass" placeholder="nouveau mot de passe" min="8" max="20">
                <label for="newPass" class="form-group">nouveau mot de passe</label>
                <span>{{newpassError}}</span>
            </div>

            <button class="btn btn-primary my-3">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios'
import Error from './Error'
import {  useField, useForm } from 'vee-validate';
// import { ref, } from 'vue'
import * as yup from 'yup';     
import Swal from 'sweetalert2'
import Logo from './Logo'

export default {
    name: "UpdatePass",
    components: {
        Error,
        Logo
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            oldPass:"",
            // newPass:"",
            error:""
        }
    },
    setup() {
        // Define a validation schema pour password
        const schema = yup.object({ 
            newPass: yup.string()
                .min(8, 'Password doit avoir au minimum 8 caractères')
                .max(20, 'Password doit avoir au maximum 20 caractères')
                .required('Password est demandé')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/, "Password doit avoir au minimum 1 majuscule, 1 minucule, 1 chiffre, 1 charactère spécial (@$!%*#?&.)")
                ,
        })
        // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        const { value:newPass, errorMessage: newpassError } = useField('newPass');
        return {
            // error,
            newPass,
            newpassError
        };
    },
    methods: {
        // fonction pour changer password
        async changePass () {
            await axios.put(`api/auth/updatePassword/${this.id}`, {
                oldPass: this.oldPass,
                newPass: this.newPass
            })
                .then( response => {
                    console.log(response);
                    // alert('Succès! Connecter avec votre nouveau password')
                    Swal.fire('Connecter avec votre nouveau password')
                    this.$router.push('/login')
                })
                .catch( e => {
                    console.log(e);
                    this.error= "Password incorrect"
                })
        }
    }
    
}
</script>