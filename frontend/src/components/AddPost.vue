<template>
    <div>
        <error v-if="error" :error = "error"/>

    <!-- Partie pour créer un post -->
        <div class="border text-center p-2 m-auto my-3 bg-white">

            <button type="button" class="btn btn-primary col col-sm-11 col-md-6 col-lg-4 col-xl-4 gray" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Que voulez vous dire ?
            </button>

            <div class="d-flex mx-auto col col-sm-11 col-md-6 col-lg-4 col-xl-4">
                    <p class="px-4"><i class="bi bi-card-image fs-4"></i> Photo</p>
                    <p class="px-4"><i class="bi bi-camera-reels-fill fs-4"></i> Vidéo</p>
                
            </div>

        </div>

        <!-- Modal pour creer post par utilisateur (quand on click sur le button en haut-->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                        <div class="modal-content">
                            
                            <form action="/api/post/" class="modal-body px-4 my-1"  method="POST" enctype="multipart/form-data">

                                <!-- header modal -->
                                <div class="modal-header" >

                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>

                                </div>

                                <!-- textarea pour contenu -->
                                <div class="form-group">
                                    <label for="text" class="font-weight-bold">Message</label>
                                    <textarea v-model="content" class="form-control px-2" id="text " placeholder = "Votre message" rows="8"></textarea>
                                </div>
                                    
                                <!-- input file upload -->
                                <div class="input-group">
                                        
                                    <input @change="onChangeFile" type="file" ref="file" class="form-control-file" id="inputGroupFile03" aria-describedby="inputGroupFileAddon04" name="image" aria-label="UploadPhoto" accept=".jpg, .png, .jpeg, .gif, .mp4, .wav, .mov">
                                            
                                    <label class="form-group"  id="inputGroupFileAddon03"><i class="bi bi-card-image"></i> Photo <i class="bi bi-camera-reels-fill"></i> Video</label> <br>

                                    <span id="error_file" class="text-center text-danger fw-bold"></span>

                                    <span class="flou">( Format accepté: .jpeg, .jpg, .png, .gif, .mp4, .wav, .mov)</span>

                                </div>

                                <!-- footer modal -->
                                <div class="modal-footer">
                                    <button @click="handleSubmit"  id="closeModal"  data-bs-dismiss="modal" type="submit" class="my-4 text-center mx-auto btn-primary" >Enregistrer</button>
                                </div>

                            </form>
                            
                        </div>
                    </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from '../axios'
import Swal from 'sweetalert2'
import Error from './Error';
export default {
    name: "AddPost",
    components: {
        Error,
    },
    data () {
        return {
            content:'',
            id: localStorage.getItem('id'),
            image: '',
            video: '',
            error:'',
        }
    },
    props: {
        // fonction getAllPosts
        method: { type: Function },
    },
    methods: {
        // fonction pour upload photo dans avatar
        onChangeFile(e) {
            this.image = e.target.files[0];
            let filename = this.image.name
            let error_file = document.getElementById('error_file')
            let extensions = /(\.jpg|\.jpeg|\.png|\.mp4|\.mov|\.wav)$/i; 
            if (!extensions.exec(filename)) {
                Swal.fire({
                            icon: 'error',
                            text:'Format de fichier non valide'
                        })
                error_file.innerHTML = "Accepte seulement file .png, .jpg, .jpeg"
                
                return false; 
                }
            else {
                error_file.innerHTML = ""
            }
        },

        // fonction pour submit formulaire add post
        async handleSubmit () {
            // s'il y a rien dans ensemble des champs, on fait rien...
            if (this.content =="" && this.$refs.file.files.length ==0) {
                Swal.fire("Vous n'avez rien à nous dire ? ")
            }
            else {
            // si non, envoyer les infos par FormData
            console.log(this.image)
                let form = new FormData();
                form.append('content', this.content)
                form.append('userId', this.id)
                form.append('image', this.image)

                // envoyer formulaire par axios, recevoir la response
                await axiosInstance.post("/api/post/", form)
                    .then( response => {
                        console.log(response);
                        // envoyer 1 message OK pour utilisateur
                        this.$store.dispatch ('post/getAllPosts', response.data)
                        Swal.fire("Votre article a été enregistré")

                        this.error=""
                        // reload la page des publications
                        this.method()
                    })
                    .catch( err => {
                        console.log(err);
                        this.error = "Problème pour enregistrer votre article"
                        Swal.fire({
                            icon: 'error',
                            text:"Problème pour enregistrer votre article"
                        })
                    }) 
            }
        },
        
    },
}
</script>

<style scoped>
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
</style>>
