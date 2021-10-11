'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      nom: 'Palacios',
      prenom: 'Jonathan',
      email: 'jonathan.palacios@free.fr',
      password: 'Azerty0123',
      fonction: 'admin',
      pseudo: 'Jonathan',
      avatar:'',
      isAdmin: true,
      
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
