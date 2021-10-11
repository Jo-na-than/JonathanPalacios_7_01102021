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
