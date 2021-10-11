'use strict';
// const crypto = require ('crypto')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      prenom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: "email"
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fonction: {
        allowNull: true,
        type: Sequelize.STRING
      },
      pseudo: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: "pseudo"
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // await queryInterface.addColumn( 
    //   'Users', 
    //   'createPasswordResetToken',
    //   {
    //     type: SEQUELIZE.STRING,
    //     set () { 
    //       const resetToken = crypto.randomBytes(32).toString('hex');
    //       crypto.createHash('sha256').update(resetToken).digest('hex')
    //     }
    //   }
      
    // )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
    // await queryInterface.removeColumn('User','createPasswordResetToken')
  }
};