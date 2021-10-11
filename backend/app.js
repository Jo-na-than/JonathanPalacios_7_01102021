// Import les modules nécessaires pour serveur
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser')
const app = express();

// Import les modules pour une protection api
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit'); 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100  // limit each IP to 100 requests per windowMs
});
const expressSanitizer = require('express-sanitizer');

// Chargement du fichier .env pour garder secret les infos confidentiels
require('dotenv').config(); 

// SetHeader
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
})

// Utiliser le cookie-parser
app.use(cookieParser())

// Parse requests of content-type - application/json
app.use(cors({origin: 'http://localhost:8080'}, {credentials: true}));

app.use(helmet());
app.use(limiter);
app.use (expressSanitizer());

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Imports les routes user et post

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/posts');

// Route authentification pour la gestion des utilisateurs
app.use('/api/auth', userRoutes);

// Route pour la gestion des posts d'actualités
app.use('/api/post', postRoutes )

// Route pour stocker les images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;