<template>
    <div>
        <div class="col shadow rounded mx-auto mt-3 mb-3 py-5">
                <!-- afficher error -->
                <error v-if="error" :error = "error"/>

                <!-- Component pour créer nouveau publication -->
                <AddPost :method="getAllPosts"/>

                <h3 class="text-center mx-auto my-3 pink">Les actualités </h3>

                <hr class="text-primary">

                <!-- Partie pour afficher les actualités  -->
                <div :key="post.id" v-for="( post, index ) in posts" class="mini border my-5 bg-white">
                    <div class="d-flex justify-content-between mt-1 mb-1">

                        <!-- image avatar et pseudo -->
                        <div class="hidden">
                            <img class="b-avatar rounded-circle" :src="`http://localhost:5000/images/${post.User.avatar}`" :alt=" `avatar de ${post.User.pseudo}`" />
                            <p class="font_superlight py-1">{{post.User.pseudo}}</p>
                            <p class="font_light"> publié {{post.updatedAt}}</p>   
                        </div>

                        <!-- Titre -->
                        <div>
                            <h4 class="mx-auto">{{post.title}}</h4>
                        </div>
                        
                        <!-- Si currentUser est auteur de l'article ou admin, il peut le modifier et supprimer -->
                        <div v-if="currentUserId==post.userId || user.user.isAdmin===true" class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-pencil"></i>
                            </button>

                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li v-if="currentUserId==post.userId" :key="post.id"><button type="button"   :data-bs-target="`#modify${post.id}`" data-bs-toggle="modal" class="btn dropdown-item " >Modifier</button></li>

                                <li v-if="currentUserId==post.userId || user.user.isAdmin===true" @click="deletePost (index)"><a class="dropdown-item" href="#">Supprimer</a></li>
                            
                            </ul>

                        </div>

                        <!-- Modal formulaire pour modify publication -->
                            <div class="modal fade"  :id="`modify${post.id}`" tabindex="-1" aria-labelledby="modify" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-scrollable">
                                    <div class="modal-content">

                                        <!-- header modal -->
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLabel">Modifier votre publication</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <!-- body modal -->
                                        <div class="modal-body">

                                            <form @submit.prevent="modifyPost (index)" method="POST" enctype="multipart/form-data">

                                                <!-- textarea contenu -->
                                                <div class="mb-3">
                                                    <label for="message-text" class="col-form-label">Message</label>
                                                    <textarea v-model="post.content" class="form-control" :id="`message-text${post.id}`" ></textarea>
                                                </div>

                                            <!-- input pour modifier image et video -->
                                                <div class="input-group">
                                        
                                                    <input @change.stop="onChangeFile(index, $event)" v-on="post.img_url" ref="file" type="file" class="form-control-file " :id="`inputFile${post.id}`" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .mp4, .wav, .mov">

                                                    <label class="form-group"  :for="`inputFile${post.id}`">
                                                        <i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video
                                                    </label>
                                                    <span :id="`error_file${post.id}`" class="text-center text-danger fw-bold"></span>
                                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .mp4, .wav, .mov)</span>

                                                </div>

                                                <div class="text-center my-3">
                                                    <button @click.prevent="modifyPost (index)" :id="`submitModify${post.id}`" type="submit" data-bs-dismiss="modal" class="btn btn-primary">Enregistrer</button>
                                                </div>

                                            </form>
                                        </div>

                                    </div>
                                </div>

                            </div>

                    </div>

                    <!-- afficher le corps de l'article -->
                    <div class=" p-3 mx-auto">
                        <p >{{post.content}}</p>
                    </div>

                    <!-- afficher image   -->
                    <div v-if="post.img_url !='' && (post.img_url.includes('.jpg') || post.img_url.includes('.jpeg') || post.img_url.includes('.png') || post.img_url.includes('.gif') ) "  class="mx-auto text-center">

                            <img class="img img-fluid mx-auto" :src="getImage(index)" :alt="`photo illustration ${post.User.pseudo}`" />
                    </div>
                    
                    <!-- afficher vidéo/audio -->
                    <div v-if="post.img_url !='' && ( post.img_url.includes('.mp4') || post.img_url.includes('.wav') || post.img_url.includes('.mov')) " class="mx-auto embed-responsive embed-responsive-16by9 text-center">
                        
                        <video class="embed-responsive-item mx-auto" muted :src="getImage (index)" :alt="`video illustration ${post.User.pseudo} `" allowfullscreen controls/>
                        
                    </div>

                    <hr>
                    <!-- bouton ajouter/ delete like -->
                    <div class="mx-auto my-1">
                        <button @click="ajouteLike(index)" class="btn fs-4 font-weight-bolder"><i class="bi bi-hand-thumbs-up"></i>{{post.likes.length}}</button>
                        
                    </div>

                    <!-- afficher les commentaires -->
                    <div >

                        <div class="form-floating">
                            <!--input ajouter commentaire -->
                            <input  @change="loadComment(index)" class="form-control " type="text" :id="`commentaire${post.id}`" name="commentaire" placeholder="Ecrivez une commentaire" />
                            <label :for="`commentaire${post.id}`">Ecrivez une commentaire</label>
                        </div>

                        <!-- afficher commentaires -->
                            <div :key="commentaire.id" v-for="commentaire in post.commentaires" class="d-flex rounded-pill border text-center my-3 py-1 ">

                                <!-- afficher userAvatar et son pseudo -->
                                <div class="align-self-center">
                                    <img  class="b-avatar rounded-circle ml-3 my-2" :src="`http://localhost:5000/images/${commentaire.userAvatar}`" :alt=" `avatar de ${commentaire.userPseudo}`" />

                                    <p class=" font_superlight ml-3">{{commentaire.userPseudo}}</p>
                                </div>

                                <!-- Les commentaires -->
                                <p class="px-3 align-self-center">{{commentaire.commentaires}}</p>
                            </div>
                        
                    </div>
                </div>

            </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axiosInstance from '../axios'
import Swal from 'sweetalert2'
import AddPost from './AddPost'
import Error from './Error'

export default {
    name: "AllPost",
    components : {
        AddPost,
        Error
    },

    data () {
        return {
            posts: [],
            currentUserId:localStorage.getItem('id'),
            error: '',
        }
    },

    async created () {
        //récupérer tous les publications dès début
        this.getAllPosts()
    },

    methods: {
        // récupérer tous les publications
        async getAllPosts () {
            await axiosInstance.get('api/post/')
            .then( response => {
                this.posts = response.data;
                this.$store.dispatch('post/getAllPosts', response.data)
            })
            .catch( err => {
                console.log(err);
                this.error = "Problème connexion avec server"
            });
        },

        // supprimer post par user
        async deletePost (index) {
            let postId = this.posts[index].id;          //récupérer id du post
            await axiosInstance.delete(`api/post/${postId}`)    // envoyer au server
                .then( response => {
                    console.log(response);
                    Swal.fire('Votre publication a été supprimé');
                    this.getAllPosts()                  // reload les publications
                })
                .catch (err => {
                    console.log(err);
                    this.error = "Problème server pour supprimer post. Réessayer plus tard"
                })
        },

        // valider input upload file
        async onChangeFile(index, event) {
            let postId = this.posts[index].id           // récupérer id du post
            // Récupére le file d'image
            let inputFile = document.getElementById(`inputFile${postId}`).files[0]
            let inputFileName = inputFile.name

            // valider le mimetype du file upload
            let error_file = document.getElementById(`error_file${postId}`)
            let extensions = /(\.jpg|\.jpeg|\.png|\.mp4|\.mov|\.wav)$/i; 
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
            let postId = this.posts[index].id           // récupérer id du post
            // Récupére le file d'image
            let inputFile = document.getElementById(`inputFile${postId}`).files[0]
	
            // envoyer tous les informations par FormData
            let form = new FormData();
            if ( inputFile != "undefined" || inputFile !="") {
                form.append('image', inputFile)
                form.append('content', this.posts[index].content)
            }
            else {
                form.append('content', this.posts[index].content)
            }
                // envoyer formulaire par axios, recevoir la response
            await axiosInstance.put(`/api/post/${postId}/${this.currentUserId}/update`, form
            )
                .then( response => {
                    console.log(response);
                        // envoyer 1 message OK pour utilisateur
                    Swal.fire("Votre article a été modifié")
                    this.error=""
                    // reload les publications
                    this.getAllPosts()
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
        
        // ajouter/ delete like du post
        async ajouteLike (index) {
            // récupérer id du user et du post
            let userId = this.currentUserId;
            let postId = this.posts[index].id;

            // envoyer en server et récupérer la response
            await axiosInstance.post(`api/post/${postId}/${userId}/like`, {
                userId: userId, postId: postId
            })
                .then( response => {
                    console.log(response);
                    // mettre à jour tableau likes sans rafraichir la page
                    this.getAllPosts()
                    })
                .catch( err => {
                    console.log(err);
                    this.error = "Problème pour ajouter like"
                })
        },

        // récupérer value de input commentaire et créer commentaire
        loadComment (index) {
            //récupérer id du post et du user
            let postId = this.posts[index].id 
            let userId = this.currentUserId;

            // récupérer la value de champs input choisi
            let saisie = document.getElementById(`commentaire${postId}`).value

            // ajouter commentaire avec la touche entrer puis envoyer au server
                axiosInstance.post('/api/post/commentaire', {
                    commentaire: saisie,
                    userId: userId,
                    postId: postId,
                    userAvatar: this.$store.state.user.user.avatar,
                    userPseudo: this.$store.state.user.user.userPseudo
                })
                // récupérer le reponse OK du server puis update les commentaires
                    .then( response => {
                        console.log(response)
                        // ajouter ce commentaire dans le tableau commentaire du post
                        this.posts[index].commentaires.unshift(saisie)

                        // update/reload la page
                        this.getAllPosts()

                        // réinitialiser la champs input => vide
                        document.getElementById(`commentaire${postId}`).value=""   
                    })
                    .catch( err => {
                        console.log(err);
                        this.error="Problème pour enregistrer votre commentaire"
                    })
        },

        // récupérer le nom de image pour afficher
        getImage(index) {
            let url = this.posts[index].img_url
            return `http://localhost:5000/images/${url}`
        },
    },
    
    computed: {
      ...mapState ( {
            user: state => state.user,
      } ),

    },

    
}
</script>

<style scoped>
    
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
    .font_light {
        font-size: 0.7rem !important;
        /* opacity: 0.5 !important; */
    }
    .font_superlight {
        font-size: 0.7rem !important;
        /* opacity: 0.5 !important; */
        color: #0000FF !important;
    }
    .mini_photo {
        width: 5rem
    }
</style>