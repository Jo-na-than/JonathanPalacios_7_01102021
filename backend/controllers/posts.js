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