<template>
    <!-- Afficher template Inscription quand toggle = off -->
        <div>
            <!-- Afficher les erreurs -->
            <error v-if="error" :error = "error"/>

            <div id="inscription" class="container mx-auto text-center">
                <div class="mx-auto">
                        <Logo class="my-5" />
                </div>

            <!-- formulaire de Signup -->
                <h5 class="pink pb-5 fw-bold fs-3 mx-auto text-center">Inscription</h5>

                <form class="form-group  mt-5 mb-5 col col-sm-8 col-md-6 col-lg-4 m-auto text-center" method="post" enctype="multipart/form-data" action="/signup" @submit.prevent = "inscriptionSubmit()" disabled id="submit">

                    <!-- input nom -->
                    <div class="form-floating mb-3">
                        <input type="text"  id="nom" name="nom" placeholder="nom" v-model="nom" required class="form-control"/>
                        <label for="nom">Nom</label>
                        <span class="text-danger">{{nomError}}</span>
                    </div>

                    <!-- input prenom -->
                    <div class="form-floating mb-3">
                        <input type="text"  id="prenom" name="prenom" v-model="prenom" placeholder="prénom" required  class="form-control"/>
                        <label for="prenom">Prenom</label>
                        <span class="text-danger">{{prenomError}}</span>
                    </div>

                    <!-- input pseudo -->
                    <div class="form-floating mb-3">
                        <input type="text" id="pseudo" name="pseudo" v-model="pseudo" placeholder="Votre pseudo" required  class="form-control"/>
                        <label for="pseudo">Pseudo</label>
                        <span class="text-danger">{{pseudoError}}</span>
                    </div>

                    <!-- input fonction -->
                    <div class="form-floating mb-3 ">
                        <input type="text"  id="fonction" name="fonction" v-model="fonction" placeholder="fonction" class="form-control"/>  
                        <label for="fonction">Fonction</label>
                        <span class="text-danger">{{fonctionError}}</span>
                    </div>

                    <!-- input email -->
                    <div class="form-floating mb-3">
                        <input type="email"  id="email" name="email" v-model="email" placeholder="email" required class="form-control"/>
                        <label for="email">Email</label>
                        <span class="text-danger">{{emailError}}</span>
                    </div>

                    <!-- input passsword -->
                    <div class="form-floating mb-3">
                        <input type="password" id="password" name="password" v-model="password" placeholder="mot de passe" required class="form-control"/>
                        <label for="password">Mot de passe</label>
                        <span class="text-danger">{{passwordError}}</span>
                    </div>

                    <!-- input confirmer password -->
                    <div class="form-floating mb-3">
                        <input type="password" id="passwordCheck" name="passwordCheck" v-model="passwordCheck" placeholder="confirmer mot de passe" required class="form-control"/>
                        <label for="passewordCheck">Confirmer mot de passe</label>
                        <span class="text-danger">{{passwordCheckError}}</span>
                    </div>
            
                    <!-- input upload file avatar -->
                    <div class="form-group row ">
                        <label class="form-text pink" for="avatar">Image profil (jpg, png, jpeg) </label>
                        <input type="file" class="form-control-file pink" id="avatar" accept=".jpg, .png, .jpeg" name="image" @change="onChangeFile">
                        <span id="error_file" class="text-center text-danger fw-bold"></span>

                    </div>

                    <!-- input select condition d'utilisation -->
                     <div class="form-group form-check">
                        <input type="checkbox" v-model="accept" id="accept" required class="form-check-input">
                        <label class="form-check-label" for="accept">Accept conditions d'utilisation </label>
                    </div>

                    <button type="submit" class="btn btn-primary button-blue text-center mb-5" id="button" >Valider</button>
            
                </form>

            </div>
        </div>
</template>

<script>
import Logo from "../components/Logo";
import Swal from 'sweetalert2'
// pour valider formulaire
import {  useField, useForm } from 'vee-validate';
import { ref, } from 'vue'
import * as yup from 'yup';

// pour connexion avec backend et serveur
import axios from '../axios'
import Error from './Error';

export default {
    name: "Signup",
    components: {
        Logo,
        Error
    },
    data() {
        return {
            avatar:'',
            error: '',
            accept: false
        }
    },
    setup () {
        // Define a validation schema avec yup
        const errors = ref([])

        const schema = yup.object({
        nom: yup.string()
                .required("Veuillez remplir votre nom")
                .matches(/^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i, "Ne pas utiliser les chiffres et les charactères spéciaux, minimum 2 charactères"),
        prenom: yup.string()
                .required("Veuillez remplir votre prénom")
                .matches(/^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i, "Ne pas utiliser les chiffres et les charactères spéciaux, minimum 2 charactères"),
        pseudo: yup.string()
                .required("Veuillez choisir votre pseudo")
                .matches(/^[a-z0-9éèàùûêâôë][a-z0-9éèàùûêâôë '-]+$/i, "Ne pas utiliser les charactères spéciaux, minimum 2 charactères"),
        fonction: yup.string()
                .matches(/^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i, "Ne pas utiliser les chiffres et les charactèrs spéciaux, minimum 2 charactères"),
        email: yup.string()
                .required('Veuillez remplir votre email')
                .email('Email invalid'),
        password: yup.string()
                .min(8, 'Mot de passe doit avoir au minimum 8 caractères')
                .max(20, 'Mot de passe doit avoir au maximum 20 caractères')
                .required('Mot de passe est demandé')
                .matches(
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/, " Mot de passe doit avoir 8 et 20 caractères, 1 majuscule, 1 minuscule, 1 charactère spécial (@$!%*#?&.)")
                ,
        passwordCheck: yup.string()
                .oneOf([yup.ref('password'), null], 'Mot de passe doit être le même ')
                .required('Confirmer votre mot de passe'),
        });

    // Create a form context with the validation schema
        useForm({
        validationSchema: schema,
        });
        // No need to define rules for fields
        const { value: nom, errorMessage: nomError } = useField('nom');
        const { value: prenom, errorMessage: prenomError } = useField('prenom');
        const { value: pseudo, errorMessage: pseudoError } = useField('pseudo');
        const { value: fonction, errorMessage: fonctionError } = useField('fonction');
        const { value: email, errorMessage: emailError } = useField('email');
        const { value: password, errorMessage: passwordError } = useField('password');
        const { value: passwordCheck, errorMessage: passwordCheckError } = useField('passwordCheck');

        return {
            errors,
            nom,
            nomError,
            prenom,
            prenomError,
            pseudo,
            pseudoError,
            fonction,
            fonctionError,
            email,
            emailError,
            password,
            passwordError,
            passwordCheck,
            passwordCheckError
        };
    },
    methods: {

        // fonction pour upload photo dans avatar
        onChangeFile(e) {
            this.avatar = e.target.files[0];
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

        // fonction pour envoyer le formulaire et signup
        async inscriptionSubmit () {
            // vérify que passeword et confirm password soit le même
            let submit = document.getElementById('submit')
            if ( this.password !== this.passwordCheck) {
                Swal.fire({
                                icon: 'error',
                                text:"Mot de passe doit être le même pour les 2 champs"
                            })
                submit.disabled= false
            }
            else {
                submit.disabled= true
                
                // envoyer le formulaire
                
                // créer utilisateur
                
                let nom = this.nom;
                let prenom= this.prenom
                let email= this.email;
                let password= this.password;
                let passwordCheck = this.passwordCheck
                let fonction = this.fonction
                let pseudo = this.pseudo
                
                let form = new FormData();
                form.append("nom", nom);
                form.append("prenom", prenom);
                form.append("email", email);
                form.append("password", password);
                form.append("passwordCheck", passwordCheck);

                form.append("fonction", fonction);
                form.append("pseudo", pseudo);
                form.append("image", this.avatar)

                // envoyer formulaire au server
                await axios.post('api/auth/signup', form) 
                    .then((response) => {                   // récupérer la response du server
                        Swal.fire( " Signup réussi, veuillez login avec votre email et password")
                        console.log(response)
                        this.error=""
                        this.$router.push("/login")              //login et aller au Home
                        })
                    .catch((e) => { 
                        console.log(e);
                        this.error = "Veuillez corriger les erreurs" })
             
            }
               
        },
        
    }
}
</script>

<style scoped lang="scss">

</style>