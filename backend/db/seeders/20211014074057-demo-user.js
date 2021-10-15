'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      lastName: 'Palacios',
      firstName: 'Jonathan',
      email: 'jonathan.palacios@free.fr',
      createdAt: new Date(),
      updatedAt: new Date(),

      
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
