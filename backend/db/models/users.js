'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.users.hasMany(models.posts, {
        foreignKey: {
          name: 'userId'
        }
      })
      models.users.hasMany(models.commentaires, {
        foreignKey: {
          name: 'userId'
        }
      })
      models.users.hasMany(models.likes, {
        foreignKey: {
          name: 'userId'
        }
      })
    }
  };
  users.init({
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    avatar: DataTypes.STRING,
    pseudo: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};