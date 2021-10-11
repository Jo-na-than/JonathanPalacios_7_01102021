// middleware pour authentification avec token
const jwt = require('jsonwebtoken');

module.exports =async (req, res, next) => {
  try {
    // récupérer le token dans le header du requête
    const token = req.headers.authorization.split(" ")[1];
    // vérify avec le secret
    await jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      console.log(err)
      // si error , envoyer code 401 unauthorized
      if (err) return res.sendStatus(401)

      req.user = user

      next()
    })
    } 
    catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};