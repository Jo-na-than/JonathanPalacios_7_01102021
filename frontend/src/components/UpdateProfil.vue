<template>
    <div class="container-fluid">
        <Logo class="my-3"/>

        <!-- afficher error -->
        <error v-if="error" :error = "error"/>

        <!-- Formulaire pour modifier profil -->
        <form class="form-group  mt-5 mb-5 col col-sm-12 col-md-8 col-lg-6 mx-auto text-center" method="post" enctype="multipart/form-data"  @submit.prevent = "changeProfil">

            <!-- input pseudo -->
            <div class="form-floating my-3">
                <input type="text" class="form-control col-sm-10" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo" >
                <label for="pseudo" class=" font-weight-bold form-group col-sm-2">Pseudo</label>
                <span class="text-danger">{{pseudoError}}</span>
            </div>

            <!-- input fonction -->
            <div class="form-floating my-3">
                <input type="text" class="form-control col-sm-10" id="fonction" name="fonction" v-model="fonction" placeholder="fonction">
                <label for="fonction" class="form-group col-sm-2 font-weight-bold">Fonction</label>
                <span class="text-danger">{{fonctionError}}</span>
            </div>

            <!-- input email -->
            <div class="form-floating my-3 text-center">
                <input type="email" class="form-control col-sm-10" id="email" name="email" v-model="email" placeholder="email">
                <label for="email" class="form-group col-sm-2 font-weight-bold">Email</label>
                <span class="text-danger">{{emailError}}</span>
            </div>

            <!-- input file upload -->
            <div class="form-group row my-3">
                <label class="form-text" for="image">Image profil (jpg, png, jpeg) </label>
                <input type="file" class="form-control-file pink" id="image" accept=".jpg, .png, .jpeg" name="image" @change="onChangeFile">
                <span id="error_file" class="text-center text-danger fw-bold"></span>

            </div>

            <!-- button annuler et submit formulaire -->
            <div class="text-center my-3 mx-auto">
                <button @click.prevent="annuler" type="submit" class="btn btn-primary text-center mb-5 mx-5" id="button" >Annuler</button>
                <button type="submit" class="btn btn-primary text-center mb-5 " id="button" >Confirmer</button>
            </div>
        </form>

    </div>
    
</template>

<script>
import {  useField, useForm } from 'vee-validate';
import { ref, } from 'vue'
import * as yup from 'yup'; 
import axios from '../axios';
import Swal from 'sweetalert2'
import Logo from './Logo'
import Error from './Error'

export default {
    name: "UpdateProfil",
    components: {
        Logo,
        Error

    },
    setup(){
        // Define a validation schema
        const errors = ref([])
        const schema = yup.object({ 
            email: yup.string()
                .email('Email invalide'),
            pseudo: yup.string()
                .matches(/^[a-z0-9éèàùûêâôë][a-z0-9éèàùûêâôë '-]+$/i, "Ne pas utiliser les charactères spéciaux, minimum 2 lettres"),
            fonction: yup.string()
                .matches(/^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i, "Ne pas utiliser les chiffres et les charactèrs spéciaux, minimum 2 lettres"),

        })
        // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        // No need to define rules for fields
        const { value: email, errorMessage: emailError } = useField('email');
        const { value: pseudo, errorMessage: pseudoError } = useField('pseudo');
        const { value: fonction, errorMessage: fonctionError } = useField('fonction');
        return {
            fonction,
            fonctionError,
            pseudo,
            pseudoError,
            email,
            emailError,
            errors
        }
    },
    data () {
        return {
            avatar: '',
            id: localStorage.getItem('id')
        }
    },
    methods: {
        // récupérer les informations de ce user
        async getUser () {
            axios.get(`api/auth/${this.id}`)
                .then( response => {
                    console.log(response)
                    this.$store.dispatch ('user/setCurrentUser', response.data.currentUser)
                })
                .catch(error => console.log(error))
        },
        // fonction pour upload photo dans avatar
        async onChangeFile(e) {
            this.avatar = e.target.files[0];
            console.log(this.avatar);
            let filename = this.avatar.name
            let error_file = document.getElementById('error_file')
            let extensions = /(\.jpg|\.jpeg|\.png)$/i; 
            if (!extensions.exec(filename)) {
                Swal.fire({
                            icon: 'error',
                            text:'Format de fichier non valide'
                        }) 
                filename = '';
                error_file.innerHTML = "Accepte seulement file .png, .jpg, .jpeg"
                
                return false; 
                }
            else {
                error_file.innerHTML = ""
            }
        },

        // fonction pour changer le profil
        async changeProfil () {
            // récupérer les champs inputs
            let email= this.email;
            let fonction = this.fonction;
            let pseudo = this.pseudo;
            
            // mettre dans FormData 
            let form = new FormData();
            form.append("email", email);
            form.append("fonction", fonction);
            form.append("pseudo", pseudo);
            form.append("image", this.avatar)

            // et envoyer au server
            await axios.put(`/api/auth/updateUser/${this.id}`, form)
                .then( response => {
                    console.log(response);
                    this.error = ""
                    // this.getUser()
                    Swal.fire("Votre profil a été modifié.")
                    this.$router.push('/user')
                })
                .catch( err => {
                    console.log(err);
                    this.error = "Problème pour update votre profil. Corriger les erreurs!";
                    Swal.fire({
                            icon: 'error',
                            text:'Problème pour update votre profil. Corriger les erreurs!'
                        })
                })
        },

        // fonction pour annuler action changeProfil
        annuler () {
            this.$router.push('/user')
        }
    }
}
</script>

<style scoped>

</style>