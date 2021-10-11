<template>
    <div class="text-center">
        <error v-if="error" :error = "error"/>

        <!-- tableau liste des utilisateurs -->
        <h3 class="text-center pink my-5">Liste les utilitasateurs du site</h3>
        <div class="table-responsive">

            <table class="table table-bordered table-striped mx-auto">
                <thead>
                    <tr class="text-center text-primary font-weight-bold" >
                        <th scope="col" class="" >Id</th>
                        <th scope="col" class="">Nom</th>
                        <th scope="col" class="">Prénom</th>
                        <th scope="col" class="">Pseudo</th>
                        <th scope="col" class="">Date entrée</th>
                        <th scope="col" class="">Admin</th>
                        <th scope="col" class="">Delete</th>
                    </tr>
        
                </thead>

                <tbody>
            
                    <tr :key="user" v-for="(user, index) in users"  class="text-center  ">
                        <th scope="col" class="">{{user.id}}</th>
                        <th scope="col" class="">{{user.nom}}</th>
                        <th scope="col" class="">{{user.prenom}}</th>
                        <th scope="col" class="">{{user.pseudo}}</th>
                        <th scope="col" class="">{{user.createdAt}}</th>
                        <th scope="col">
                            <button class="btn btn-primary" @click = "adminChange(index)">{{user.isAdmin}}</button>
                        </th> 
                        <th scope="col">
                            <button class="btn btn-danger" @click = "adminDelete(index)">Supprimer </button>
                        </th>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axiosInstance from '../axios'
import Error from './Error'
import Swal from 'sweetalert2'

export default {
    name:"Admin",
    components: {
        Error,
    },
    data () {
        return {
            id: localStorage.getItem('id'),
            users: [],
            error: '',
        }
    },
    // récupérer les users
    async created () {
        this.getAllUsers()         
    },

    methods: {
        // method pour récupérer tous les users
        async getAllUsers () {
            await axiosInstance.get(`api/auth/admin/${this.id}`)
                .then (response => {
                    this.users = response.data.users       
                })
                .catch ( err => {
                    console.log(err);
                    this.error = "Problème pour récupérer les utilisateurs. Réessayer plus tard"
                })
        },

        // supprimer user par admin, avec modèle de sweatalert2
        async adminDelete (index) {
            await Swal.fire({
                title: 'Vous êtes sûr?',
                text: "Vous ne pouvez pas revenir en arrière!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.isConfirmed) {       // click sur button confirmer
                    let id = this.users[index].id;

                    // envoyer au server pour supprimer user
                    axiosInstance.delete(`api/auth/adminDelete/${id}`)
                        .then(response => {
                            console.log(response);
                            // this.users.splice(index,1)  // supprimer user dans la liste
                            Swal.fire(
                                'Supprimé!',
                                'Utilisateur supprimé.',
                                'success'
                            )
                            this.getAllUsers()      // reload des users
                        })
                        .catch( err => { console.log(err);
                        this.error = "Problème pour supprimer utilisateur. Réessayer plus tard"})
                }
            })
        },

        // changer le status admin pour les users
        async adminChange(index) {
            // si cet user est déjà admin, on ne peut pas faire le changement
            if ( this.users[index].isAdmin == true) {
                Swal.fire("Cet utilisateur est déjà admin du site")
            }
            // si user n'est pas  admin, utiliser modèle de sweatalert2 pour confirmer choix
            else {
                await Swal.fire({
                    title: 'Vous êtes sûr de passer cet utilsateur en admin?',
                    text: "Il aura tous les pouvoirs du admin!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                    }).then((result) => {
                        // avec button confimer
                    if (result.isConfirmed) {
                        //prendre id de user
                        let userId = this.users[index].id;
                        // envoyer au server pour changer en admin
                        axiosInstance.put(`api/auth/adminChange/${userId}/${this.id}`)
                            .then(response => {
                                console.log(response);
                                Swal.fire(
                                    'Changé en admin!',
                                    'Admin ajouté.',
                                    'success'
                                )
                                // reload le taleau users
                                this.getAllUsers()  
                            })
                            .catch( err => { console.log(err);
                            this.error = "Problème pour attribuer le rôle admin pour utilisateur. Réessayer plus tard"})
                    }
                }) 
            }
        }
    }

}
</script>

<style scoped>
    .text-primary {
        color: #0000FF !important;
    }
    .btn-danger {
        cursor: pointer;
    }
</style>