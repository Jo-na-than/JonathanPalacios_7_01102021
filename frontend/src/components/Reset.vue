<template>
    <div>

        <Logo class="my-3 text-left" />
    
        <!-- formulaire pour reset password en cas d'oublie -->
        <form class="mx-auto text-center my-5 col col-md-5 col-lg-4 col-xl-4" @submit.prevent = "handleSubmit()" disabled id="submit">
            <h3 class="pink">Reset password</h3>

            <!-- input password -->
            <div class="form-floating my-3">
                <input type="password" id="password" placeholder="Mot de passe" class="form-control" v-model="password" required />
                <label for="password" class="form-group">Mot de passe</label>
                <span class="text-danger">{{passwordError}}</span>
            </div>

            <!-- input confirmer password -->
            <div class="form-floating my-3">
                <input type="password" id="passwordConfirm" placeholder="Confirmer mot de passe" class="form-control" v-model="passwordConfirm" required />
                <label for="passwordConfirm" class="form-group">Confirmer mot de passe</label>
                <span class="text-danger">{{passwordConfirmError}}</span>
            </div>

            <button class="btn btn-primary">Valider</button>
        </form>
    </div>
</template>

<script>
import axios from '../axios'
import {  useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { ref, } from 'vue'
import Swal from 'sweetalert2'
import Logo from './Logo'
export default {
    name: "Reset",
    components: {
        Logo
    },
    setup(){
        // un schema pour valider password avant envoyer au server
        const error = ref([])
        const schema = yup.object ({
            password: yup.string()
                .min(8, 'Password doit avoir au minimum 8 characters')
                .max(20, 'Password doit avoir au maximum 20 characters')
                .required('Password est demandé')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/, "Mot de passe doit avoir au minimum 8 charactères dont 1 majuscule, 1 minucule, 1 chiffre, 1 charactère spécial (@$!%*#?&.)")
                ,
        passwordConfirm: yup.string()
                .oneOf([yup.ref('password'), null], 'Mot de passe doit être le même pour les 2 champs')
                .required('Confirm votre mot de passe'),
        })
        // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        const { value: password, errorMessage: passwordError } = useField('password');
        const { value: passwordConfirm, errorMessage: passwordConfirmError } = useField('passwordConfirm');
        return {
            error,
            password,
            passwordConfirm,
            passwordError,
            passwordConfirmError
        }
    },
    methods: {
        // fonction pour reset password avec le token reçu
        async handleSubmit() {
            // récupérer le token dans le parametre http
            let token = this.$route.params.token
            let submit = document.getElementById('submit')
            if ( this.password !== this.passwordConfirm) {
                submit.disabled= false
            }
            else {
                submit.disabled= true;
                // envoyer au server token, password
                await axios.patch(`api/auth/reset/${token}`, {
                    password: this.password,
                    token
                })
                    .then( response => {
                        Swal.fire("Succès. Connecter vous avec nouveau password")
                        this.$router.push('/login')
                        console.log(response)

                    })
                    .catch( err => {
                        console.log(err);
                        Swal.fire({
                                icon: 'error',
                                text:"Mot de passe doit avoir au minimum 8 charactères dont 1 majuscule, 1 minucule, 1 chiffre, 1 charactère spécial"
                            })
                        
                        })
            }
            
        }
    }
}
</script>
