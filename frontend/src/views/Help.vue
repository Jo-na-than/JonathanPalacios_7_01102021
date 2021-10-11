<template>
  <div class="container">

    <h3 class="text-center my-3 pink">FAQ</h3>

    <!-- Foire au question -->
    <div class="">
        <details class="shadow rounded col  mx-auto mt-3 mb-3 py-3 my-5 bg-white">
          <summary class="text-primary">
            Comment supprimer une publication ?
          </summary>
          <p class="">Si vous êtes auteur: cliquez sur icon crayon , puis supprimer </p>
          <p class="">Si vous n'êtes auteur et vous trouvez que le contenu n'est pas approprié: veuillez signaler au admin en cliquant 
            <a class="text-danger font-weight-bold" href="mailto:admin@groupomania@fr">admin@groupomania@fr</a>
          </p>

        </details>

        <details class="shadow rounded col  mx-auto mt-3 mb-3 py-3 my-5 bg-white">
          <summary class="text-primary">
            Comment modifier une publication ?
          </summary>
            Cliquez sur icon crayon à côté du titre de publication, puis modifier
        </details>

        <details class="shadow rounded col  mx-auto mt-3 mb-3 py-3 my-5 bg-white">
          <summary class="text-primary">
            Comment modifier mon compte?
          </summary>
            Allez dans votre espace profil, choisissez onglet <strong>Modifier Profil</strong> puis confirmer les changements.
        </details>

        <details class="shadow rounded col  mx-auto mt-3 mb-3 py-3 my-5 bg-white">
          <summary class="text-primary">
            Comment supprimer mon compte?
          </summary>
            Allez dans votre espace profil, choisissez onglet <strong>Supprimer mon compte</strong>, confirmer votre mot de passe.
        </details>

        <details class="shadow rounded col  mx-auto mt-3 mb-3 py-3 my-5 bg-white">
          <summary class="text-primary">
            Comment nous contacter?
          </summary>
            En cas de problème ou pour plus d'informations, envoyer un mail au:
            <a class="text-danger font-weight-bold" href="mailto:admin@groupomania.fr">admin@groupomania.fr</a>
        </details>
    </div>

  </div>
</template>

<script>

export default {
  name: "Help",
}
</script>

<style lang="scss" scoped>
  summary{
    font-size: 1.5rem;
    color: #0000FF !important;
  }

</style>
