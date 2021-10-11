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