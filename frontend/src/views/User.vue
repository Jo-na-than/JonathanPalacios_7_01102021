<template>
    <div class="container">
        
        <Logo class="my-5"/>

        <div class="container mx-auto mt-5 mb-5 col ">
            <error v-if="error" :error = "error"/>
    <!-- Profil user-->

            <!-- Partie afficher avatar -->
            <div class="row shadow rounded col d-flex mx-auto px-5 my-5">
                <img class="monAvatar img-fluid my-2 rounded-circle " :alt="`avatar${user.user.userPseudo}`" :src= "`http://localhost:5000/images/${user.user.avatar}`" />
                <p class="pink font-weight-bold"> {{user.user.userPseudo }} </p>

            </div>

            <!-- Partie afficher le profil et modifier -->
            <div class="col shadow rounded mx-auto mt-3 mb-3 px-5 py-5">
                <h3 class="pink">A propos de moi</h3>
                <p class="">Nom et prenom : <strong>{{ user.user.userNom }}</strong>  </p>
                <p class="">Pseudo : <strong>{{ user.user.userPseudo }}</strong>  </p>

                <!-- Les buttons pour modifier profil et password -->
                <div class="text-center d-flex flex-column mx-auto">
                    <button class="col col-md-6 col-lg-4 mx-auto btn btn-primary mb-3 text-center" @click.prevent = "updateUser">MODIFIER PROFIL</button> 
                    <button class="col col-md-6 col-lg-4 mx-auto btn btn-primary mb-3 text-center" @click.prevent = "updatePass">MODIFIER PASSWORD</button>
                </div>
            </div>

            <!-- Ce bloc est pour admin récupérer tous les user et delete 1 user -->
            <div v-if="user.user.isAdmin===true" class="text-center col shadow rounded mx-auto mt-3 mb-3 px-5 py-5">
                <button class="btn col col-md-6 col-lg-4 mx-auto btn btn-primary mb-3 text-center" @click.prevent = "admin">Gérer les utilisateurs</button>
            </div>

            <!-- Mes publications, quand on click, les articles s'affichent -->
            <div class="accordion col shadow rounded mx-auto my-3 py-5" id="accordionExample">

                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button @click="getUserPosts" class="accordion-button btn-primary fs-4" type="button" data-bs-toggle="collapseOne" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" >
                            Mes publications
                        </button>

                    </h2>

                    <div :key="userPost" v-for="(userPost, index) in userPosts"  id="collapseOne" class="accordion-collapse collapse show p-2 my-2" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body shadow my-5">

                            <div class="d-flex justify-content-between">

                                <!-- Le titre -->
                                <h4 class="font-weight-bold">{{userPost.title}}</h4>

                                <!-- Si currentUser est auteur de l'article ou si c'est admin, il peut le modifier et supprimer -->
                                <div v-if="id==userPost.userId || user.user.isAdmin===true" class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <li :key="userPost.id"><button type="button"   :data-bs-target="`#modify${userPost.id}`" data-bs-toggle="modal" class="btn dropdown-item" >Modifier</button></li>
                                        <li @click="deletePost (index)"><a class="dropdown-item" href="#">Supprimer</a></li>
                                    
                                    </ul>

                                </div>
                            </div>
                            
                            <!-- Modal formulaire pour modify publication -->
                            <div class="modal fade"  :id="`modify${userPost.id}`" tabindex="-1" aria-labelledby="modify" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-scrollable">
                                    <div class="modal-content">

                                        <!-- header modal-->
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Modifier votre publication</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <!-- body modal-->
                                        <div class="modal-body">
                                            <form  method="POST" enctype="multipart/form-data" class="needs-validation" novalidate>

                                                <!--Textarea Contenu -->
                                                <div class="mb-3">
                                                    <label for="message-text" class="col-form-label">Contenu</label>
                                                    <textarea v-model="userPost.content" class="form-control" id="message-text" ></textarea>
                                                </div>

                                                <div class="input-group">
                                        
                                                    <input @change="onChangeFile(index, $event)" v-on="userPost.img_url"  type="file" class="form-control-file" :id="`inputFile${userPost.id}`" aria-describedby = "inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .mp4, .wav, .mov,">

                                                    <label class="form-group"  :for="`inputFile${userPost.id}`"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label>

                                                    <span :id="`error_file${userPost.id}`" class="text-center text-danger fw-bold"></span>

                                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .mp4, .wav, .mov )</span>
                                                </div>

                                                <div class="text-center">
                                                    <button @click.prevent="modifyPost (index)" :id="`submitModify${userPost.id}`" type="submit" class="btn btn-primary mx-auto my-5" data-bs-dismiss = "modal" >Enregistrer</button>
                                                </div>
                                                
                                        </form>    

                                        </div>

                                        <!-- footer modal -->

                                    </div>
                                </div>

                            </div>

                            <!-- Le contenu du publication-->
                            <div>
                                <p class="p-2 "> {{userPost.content}}</p>
                                
                            </div>

                            <!-- afficher image   -->
                            <div v-if="userPost.img_url !='' && (userPost.img_url.includes('.jpg') || userPost.img_url.includes('.jpeg') || userPost.img_url.includes('.png') || userPost.img_url.includes('.gif') ) "  class="text-center">
                                <img class="img img-fluid mx-auto" :src="getImage(index)" :alt="`photo illustration ${user.user.userPseudo}`" />
                            </div>

                            <!-- afficher vidéo/audio -->
                            <div v-if="userPost.img_url !='' && ( userPost.img_url.includes('.mp4') || userPost.img_url.includes('.wav') || userPost.img_url.includes('.mov')) " class="embed-responsive embed-responsive-16by9 text-center">
                                
                                <video class="embed-responsive-item mx-auto" muted :src="getImage (index)" :alt="`video illustration ${user.user.userPseudo} `" allowfullscreen controls/>
                                
                            </div>

                            <hr class="text-primary">

                            <!-- Les likes -->
                            <div>
                                <i class="bi bi-hand-thumbs-up"></i> {{userPost.likes.length}}
                            </div>

                            <!-- Les commentaires -->
                            <div>
                                <p class="text-right font-italic"> Commentaires</p>
                                <!-- Les commentaires -->

                                <div :key="commentaire.id" v-for="commentaire in userPost.commentaires" class="d-flex rounded-pill border text-center my-3 py-1 ">
                                        <!-- afficher userAvatar et son pseudo -->
                                    <div class="align-self-center">
                                        <img class="b-avatar rounded-circle ml-3 my-2" :src="`http://localhost:5000/images/${userPost.User.avatar}`" />
                                        <p class="text-primary font_superlight ml-3 ">{{commentaire.userPseudo}}</p>
                                    </div>

                                <!-- Les commentaires -->
                                        <p class="px-3 align-self-center">
                                            {{commentaire.commentaires}}
                                        </p>
                                </div>
                                
                                
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>


            <!-- Supprimer le compte user -->
            <div class="col shadow border border-danger rounded m-auto mt-3 mb-3 px-5 py-5">
                <h3 class="text-danger">Supprimer le compte</h3>
                <p>Si vous souhaitez supprimer votre compte, cliquez sur le button et confirmer</p>
                <button class="btn btn-danger" @click.prevent = "deleteUser">Supprimer mon compte</button>
            </div>

        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '../axios'
import Swal from 'sweetalert2'
import Error from '../components/Error';
import Logo from '../components/Logo'

export default {
    name: "User",
    components: {
        Error,
        Logo
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            error: '',
            userPosts: [],
            url_img: [],
            lien: []
        }
    },

    

    computed: {
      ...mapState ( { user: state => state.user} ),
    },
    
    // récupérer les publications du user
    async created () {
        this.getUser()
        this.getUserPosts()
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
        
        // user supprimer son compte avec modèle sweatalert2
        async deleteUser () {
            console.log(this.id)        //OK
            // Utiliser sweatalert2 pour demander confirmation du password avant tout 
            const { value: password } = await Swal.fire({
                title: 'Entrer votre password pour supprimer votre compte',
                input: 'password',
                inputLabel: 'Password',
                inputPlaceholder: 'Password',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true,
                })
                // si user confirmer password, envoyer au server
                if (password) {
                    console.log(password);          //OK
                    axios.post(`api/auth/delete/${this.id}`,
                        {password : password })
                    // recevoir la reponse OK du server, effacer token dans mémoire, et vuex
                    .then((response) => {
                        console.log(response)
                        localStorage.removeItem('token');
                        this.$store.dispatch('user/setCurrentUser', null)
                        // revenir au Home
                        Swal.fire("Votre compte a été supprimé. Retour à Home")
                        this.$router.push("/")
                    })
                    // En cas d'erreur du password, envoyer message
                    .catch (error => {
                        console.log(error);
                        Swal.fire("Password incorrect, veuillez réessayer")
                    })        
            }
        },

        //aller sur page update profil
        async updateUser () {
            this.$router.push("/updateProfil")
        },

        // aller sur page update password
        async updatePass () {
            this.$router.push("/updatePass")
        },

        // aller sur page admin
        admin () {
            this.$router.push("/admin")
        },

        // récupérer tous les post du User
        async getUserPosts () {
            await axios.get(`api/post/${this.id}`)      //demander les posts du server
            .then( response => {
                this.error=""
                this.userPosts = response.data;         //mettre la reponse du server dans data
                
                // mettre les photos du publications dans url_img
                for (let i =0; i< this.userPosts.length; i++) {
                    this.url_img.push(this.userPosts[i].img_url) 
                }
            })
            .catch( err => {
                console.log(err);
                this.error = "Problème server, impossible récupérer vos publications"
            })
        },

        // recuperer le file upload et valider avant envoyé
        async onChangeFile(index, event) {
            // récupérer id du post et le file de input
            let postId = this.userPosts[index].id 
            let inputFile = document.getElementById(`inputFile${postId}`).files[0];
            let inputFileName = inputFile.name

            // valider le mimetype du file upload
            let error_file = document.getElementById(`error_file${postId}`)
            let extensions = /(\.jpg|\.jpeg|\.png|\.mp4|\.mov|\.wav)$/i;
            // sile MIME TYPE n'est pas correct, => alert, envoyer erreur
            if (event && !extensions.exec(inputFileName)) {
                Swal.fire({
                            icon: 'error',
                            text:'Format de fichier non valide'
                        })
                error_file.innerHTML = "Accepte seulement file .png, .jpg, .jpeg, .mp4, .mov, .wav"
                event.preventDefault()
                event.stopPropagation()
                return false; 
            }
            else {
                error_file.innerHTML = ""
            } 
        },
        // modify post par user
        async modifyPost (index) {
            
            // récupérer id du post et le file de input
            let postId = this.userPosts[index].id 
            let inputFile = document.getElementById(`inputFile${postId}`).files[0]

            // mettre dans FormData et envoyer au server
            let form = new FormData();
            
            form.append('image', inputFile)
            form.append('content', this.userPosts[index].content)

                // envoyer formulaire par axios, recevoir la response
                await axios.put(`/api/post/${postId}/${this.id}/update`, form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        Swal.fire("Votre article a été modifié")
                        this.error=""
                        this.getUserPosts()
                        
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                        Swal.fire({
                            icon: 'error',
                            text:"Problème pour enregistrer votre article"
                        })
                    })
        },

        // supprimer post par user
        async deletePost (index) {
            let postId = this.userPosts[index].id;
            await axios.delete(`api/post/${postId}`)
                .then( response => {
                    console.log(response);
                    Swal.fire('Votre publication a été supprimé');
                    this.getUserPosts()
                })
                .catch (err => {
                    console.log(err);
                    this.error = "Problème server pour supprimer post. Réessayer plus tard"
                })
        },

        // Récupérer le lien de l'images 
        getImage(index) {
            let url = this.userPosts[index].img_url
            return `http://localhost:5000/images/${url}`
            
        },

            
    }
  
}
</script>

<style scoped>
    .monAvatar {
        width: 10rem !important
    }
    .bi-hand-thumbs-up {
        color: red;
    }
    .bi-camera-reels-fill {
        color: #e42645
    }
    .bi-card-image {
        color: #41b35d !important
    }
    .gray {
        color: #e4e6e9 !important
    }
    .flou {
        opacity: 0.5;
    }
    .font_superlight {
        font-size: 0.6rem !important;
        opacity: 0.5 !important;
    }
</style>

