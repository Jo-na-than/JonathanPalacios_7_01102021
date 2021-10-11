// les packages nécessaires
const crypto = require ('crypto')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Model Sequelize
const db = require('../models')
const Sequelize = require('sequelize');
const association = require('../models/association').association
const sequelize = require('../models/index').sequelize;
const models = association(sequelize);

// Middleware pour envoi mail si reset/update password
const sendEmail = require('./email');

// Schema pour valider password
const validator = require('validator')
const passwordValidator = require("password-validator");
const schema = new passwordValidator();
schema
    .is().min(8)                                    // Longueur minimum 8
    .is().max(20)                                   // Longueur maximum 100
    .has().uppercase()                              // Doit contenir une majuscule
    .has().lowercase()                              // Doit contenir une minuscule
    .has().digits(1)                                // Doit contenir au moins 1 chiffres
    .has().not().spaces()                           // Doit contenir aucun espace
    .is().not().oneOf(["Passw0rd", "Password123"])  // Mot de passes blacklistés
    .has(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/)  // regex pour password fort

// Fonction pour crypter et décrypter email
// Key et Iv  pour crypto
let key = crypto.createHash("sha256").update("OMGCAT!", "ascii").digest();
let iv = "1234567890123456"
let algorithm = 'aes-256-ctr'

// Fonction pour encrypter
function encrypt(text){
    var cipher = crypto.createCipheriv(algorithm, key, iv)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

// Fonction pour decrypter
function decrypt(text){
    var decipher = crypto.createDecipheriv(algorithm, key, iv)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

// Créer une route pour enregistrer nouvel utilisateur
exports.signup = ((req, res) => {
    const userData = req.body;
    console.log(userData)       // OK

    // Crypter email entrée
    let emailHash = encrypt(userData.email)
    console.log(emailHash + " email")

        // Valider les données du email, nom, prénom, fonction avec validator
    if( !validator.isEmail(userData.email)) {return res.status(400).json({message: " Email invalid"})}

    if(!validator.matches(userData.nom, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Nom ne peut être que les lettres"})}

    if (!validator.matches(userData.prenom, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Prenom ne peut être que les lettres"})}

    if (!validator.matches(userData.pseudo, /^[a-z0-9éèàùûêâôë][a-z0-9éèàùûêâôë '-]+$/i)) {return res.status(400).json({message: " Pseudo doit être en lettre ou chiffre"})}

    if (userData.fonction.length > 0 &&  (!validator.matches(userData.fonction, /^[a-zéèàùûêâôë][a-zéèàùûêâôë '-]+$/i)) ) {return res.status(400).json({message: " veuillez ne saisir que des lettres"}) }   
    
        // Valider password avec password-validator
    if(!schema.validate(userData.password)) {return res.status(400).json({message: " Mot de passe doit avoir 8 et 20 caractères, 1 majuscule, 1 minuscule, 1 caractère spécial"})}
    
    // Vérifier si password et passwordCheck soit le même
    if ( userData.password !== userData.passwordCheck) { return res.status(400).json({message: "Mot de passe doit être le même pour les 2 champs"})}

        // Après validation des données, chercher si email est déjà utilisé ; si non crée user
    else { db.Users.findOne ( {  where: { email: emailHash }})
        .then( user => { 
                // Si trouvé user dans BDD avec email => email déjà utilisé
            if( user) {
              return  res.status(400).json({message: " email déjà utilisé"}); 
            }
            else {  // Email n'est pas dans BDD
                // Vérifier si pseudo est déjà présente dans BDD 
                db.Users.findOne ( { where: { pseudo : userData.pseudo}})
                .then( user => { 
                    if (user) {     // Pseudo trouvé dans BDD
                       return res.status(400).json({ message: " pseudo deja utilisé"});
                         
                    }
                    else {          // Pas de pseudo dans BDD
                        
                        bcrypt.hash(userData.password,10)   // Hash password, puis créer user
                            .then( hash => {
                                // S'il n'y a pas photo, prendre nom de l'image avatar default,
                                // Si non prendre le nom de requete file
                                let avatarName = "";
                                if ( req.file) { avatarName = req.file.filename}
                                else { avatarName = "avatar_default.png"} 

                                    // Créer user
                                const newUser = db.Users.create({
                                    email: emailHash,
                                    nom: userData.nom,
                                    prenom: userData.prenom,
                                    password: hash,
                                    fonction: userData.fonction,
                                    pseudo: userData.pseudo,
                                    isAdmin: 0, 
                                    avatar: avatarName
                                });
                                res.status(201).json( { message: "Utilisateur crée avec succès"})
                            })
                            .catch( () => { 
                                    res.status(400).json( {messsage: " Problème pour crée utilisateur" });   
                            } )
                    }
                })  
            }
        })
        .catch( () => res.status(500).json( { message: "Pb de server, impossible chercher email user"}))       
    }
})

// Route pour login
exports.login = (req, res) => {
    // Crypter email entrée afin de comparer avec celui dans BDD
    let emailLogin = encrypt(req.body.email)
    db.Users.findOne( {
        // Chercher user avec son email
        where: {email: emailLogin}})// trouver utilisateur avec email unique
        .then( (user) => {
            if(!user) { // Si user n'existe pas dans bdd
                return res.status(401).json({error: 'Utilisateur non trouvé'}) // renvoyer message erreur
            }
            // Si user est trouvé, comparer le mot de passe entrée avec celui dans bdd
            bcrypt.compare(req.body.password, user.password) 
                .then((valid) => {
                    if(!valid) { // Si mdp n'est pas valid, renvoyer error
                        return res.status(401).json({ error: 'Mot de passe incorrect'})
                    }
                    // Si mdp correct, renvoyer user, et token
                    else {

                        let refreshToken = jwt.sign(      // un refreshtoken pour cookie
                            {userId: user.id },
                            process.env.REFRESH_TOKEN, 
                            {expiresIn: "24h",})
                        
                        let token = jwt.sign(            // un token pour la connexion
                            {userId: user.id },
                            process.env.SECRET_TOKEN, 
                            {expiresIn: "1m",})

                        /* On créer le cookie contenant le refresh token */
                        res.cookie('refreshtoken', refreshToken,
                        {
                            httpOnly: true,
                            secure: false,
                            sameSite: false,
                            maxAge: "86400000"    // 24h en milisecond
                        })

                        res.status(200).json({ // Si mdp correct, envoyer user, token, refreshtoken                       
                            currentUser: {
                            userNom: user.nom,
                            email: req.body.email, 
                            userPseudo: user.pseudo,
                            userId: user.id,
                            avatar: user.avatar,
                            isAdmin: user.isAdmin
                            },
                            token,
                            refreshToken
                        });
                    };
                })
                .catch((error) => res.status(500).json({error}))
        })
        .catch((error) => res.status(500).json({error})) // Erreur de serveur pour la requete
}