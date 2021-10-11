const fs = require('fs');
const xss = require('xss')
const validator = require('validator')

const db = require('../models')
const Sequelize = require('sequelize');
const association = require('../models/association').association
const sequelize = require('../models/index').sequelize;
const models = association(sequelize);

// ===> Route pour créer 1 post <===
exports.createPost = (req, res) => {
    let file_url = "";
    
        // S'il y a req file, enregistrer son nom dans BDD; 
        if (req.file) {
            file_url = req.file.filename
        }
        else { file_url = ""};

            // Enregistrer dans table Posts
        const post = db.Posts.create({
            content: xss(req.body.content),
            img_url: file_url,
            userId: req.body.userId
            })
            .then( () => res.status(201).json("Votre article a été enregistré"))
            .catch( err => {
                console.log(err);
                res.status(500).json("Créer post erreur")
            })
    
}

// ===> Route pour récupérer tous les publications <===
exports.getAllPosts = (req, res) => {
    // Chercher les posts avec likes et commentaires et user
    models.posts.findAll({
        include: [ 
            {model: models.likes},
            {model: models.commentaires},
            {model: models.users,
                    attributes: ['avatar', 'pseudo']}
         ],
        order: [
            ["id", "DESC"],
            [models.commentaires, "id", 'DESC']
        ],
      })
      // Envoyer tous les posts au client side
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => res.status(500).json(error));
};

// ===> Routes pour update 1 post <===
exports.updatePost = (req, res) => {
    let newFile_url=""
    // Chercher le post avec son id
    db.Posts.findOne ( { where:  { id: req.params.postId}} )
        .then( (post) => {

            // Verifier si c'est bien le user avant de faire update
            if (post.userId != req.params.id ) {
              return  res.status(400).json("Echec! Vous n'êtes pas auteur du pubication.")
            }
            else {
                // Update sans file
                if (!req.file) {
                    
                        db.Posts.update({
                            ...post,
                            content: xss(req.body.content),},
                        {where: {id: req.params.postId}})
                            .then( () => res.status(200).json("Update publication réussi"))
                            .catch( err => res.status(500).json({
                                message: "Erreur en update publication",
                                err: err
                            }))
                    }
                
                
                // Update avec file
                else {
                    console.log(req.file)
                    // Si update avec photos,
                    if (req.file != "undefined" || req.file !="") {          
                        let filenames = post.img_url;       // Cherche nom anciennes photos
                        // Les supprimer
                        fs.unlink(`images/${filenames}`, () => {
                            console.log("images supprimé")});         

                        // Puis récupérer nouveaux files
                            
                            newFile_url = (req.file.filename);
                            
                                db.Posts.update({
                                    img_url: newFile_url,
                                    content: xss(req.body.content),
                                    },
                                    {where: {id: req.params.postId}})
                                    .then( () => res.status(200).json("Update publication réussi"))
                                    .catch( err => res.status(500).json({
                                        message: "Erreur en update publication",
                                        err: err
                                    }))
                            
                    }
                }
            }
        })
        .catch ( err => {
            // console.log(err);
            res.status(500).json({
                message:"Problème chercher publication par server",
                err: err
            })
        })
}

// ===> Route pour récupérer post d'un user <===
exports.getUserPosts = (req, res) => {
    // Chercher tous les posts, likes, commentaires du user avec son id
    models.posts
      .findAll({
        where: {userId: req.params.id},
        include: [
            {model: models.likes},
            {model: models.commentaires},
            {model: models.users,
                    attributes: ['avatar', 'pseudo']}
        ],
        order: [
            ["id", "DESC"], [models.commentaires, "id", 'DESC']
        ],
      })
      // Envoyer tous au client side
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((error) => res.status(500).json(error));
}

// ===> Route pour supprimer post <===
exports.deletePost = (req, res) => {
    // Chercher post avec son id
    db.Posts
      .findOne({ where: { id: req.params.postId } })
      .then((post) => {     
          // Chercher les images, video et effacer
            if (post.img_url !="") {
                let filenames = post.img_url
                fs.unlink(`images/${filenames}`, () => {console.log("images supprimé");});
            }
      })
        // Supprimer dans table likes
    .then(() => {
            db.likes.destroy({ where: { postId: req.params.postId } });
        })
        // Supprimer dans table commentaires
    .then(() => {
            db.commentaires.destroy({ where: { postId: req.params.postId } });
        })
        // Supprimer dans table posts
    .then(() => {
            db.Posts
            .destroy({ where: { id: req.params.postId } })
            .then(() =>
                res.status(200).json({ message: "Publications supprimée !" })
            )
            .catch((error) => res.status(400).json({ error }));
        })
    .catch((error) => res.status(500).json({ error }));
};


//====> Ajout ou suppression de like <====\\
exports.createLike = (req, res) => {
    // Chercher post avec id du user et du post
    db.likes.findOne ( {where: {
        postId: req.params.postId,
        userId : req.params.userId
    }} )
        .then ( likes => {
            if (likes) {
                // Si ce user est déjà like ce post => supprimer ce like dans table likes
                db.likes.destroy ( { where: {
                    postId: req.params.postId,
                    userId : req.params.userId
                }} )
                    .then ( () => res.status(200).json('Enlever likes du post'))
                    .catch ( err => {
                        console.log(err);
                        res.status(500).json( 'Problème pour enlever likes du post')
                    })
            }
                // Si ce user n'a pas like ce post => ajouter ce like dans table likes
            else {
                db.likes.create ({
                    postId: req.params.postId,
                    userId: req.params.userId,
                })
                    .then( () => res.status(201).json('Ajouter like au post'))
                    .catch ( err => {
                        console.log(err);
                        res.status(500).json('Problème pour ajouter like')
                    })
            }
        })
        .catch ( err => {
            console.log(err);
            res.status(500).json("problème récupérer likes")
        })
};

// ===> Récupérer les likes <===
exports.getLike = (req, res) => {
    models.likes
      .findAll({ where: { postId: req.params.postId } })
      .then((like) => {
        res.status(200).json(like);
      })
      .catch((error) => res.status(500).json(error));
};


// ===> Création commentaire <===
exports.createCommentaire = (req, res) => {
    let regex = /[@&"()_$§*€£`+=\/;#]+$/;
    // Valide le commentaire
    if (validator.matches(req.body.commentaire, regex)) {
    return res.status(400).json("Veuillez ne pas utiliser les characters spéciaux")
    }
    else {
        console.log(req.body.commentaire)
        // Créer le commentaire
        db.commentaires.create({
            commentaires: xss(req.body.commentaire),
            postId: req.body.postId,
            userId: req.body.userId,
            userAvatar: req.body.userAvatar,
            userPseudo: req.body.userPseudo
        })
            .then( () => res.status(201).json("Commentaire enregistré"))
            .catch( err => res.status(500).json( {
                message: "Problème pour enregistrer commentaire",
                err: err
            }))
    }
}

// Route pour récupérer les commentaires du publication
exports.getCommentaires = (req, res) => {
    // Chercher tous les commentaires du post avec postId
    db.commentaires.findAll ( 
        { where: {postId: req.params.postId}},
        {order: [["id", "DESC"]]},)
        .then( commentaires => {
            res.status(200).json(commentaires)
        })
        .catch (err=>  res.status(500).json({
            message: "problème récupérer commentaires",
            err: err
        }) 
        )
}