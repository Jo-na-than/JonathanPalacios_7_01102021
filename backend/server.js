// Créer server, utiliser port 5000, utiliser app comment fichier d'entrée
const http = require('http');
const app = require ('./app');

const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  const port = normalizePort(process.env.PORT || '5000');
  app.set('port', port);
  
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const server = http.createServer(app);
  
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  })
  // .catch((error) => console.log(error));
server.on('error', errorHandler);

server.listen(port);

  // connecter avec BDD sequelize

  const { Sequelize } = require('sequelize');
  const db = new Sequelize(process.env.DATABASE, process.env.NAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect:process.env.DIALECT,
    dialectOptions: {
      "ssl": false
    }
  })

db.authenticate()
  .then(() => console.log('Sequelize connecté'))
  .catch((error) => console.log({error}))

module.exports = db;