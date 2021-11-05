'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentaires extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.commentaires.belongsTo(models.users, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      });
      models.commentaires.belongsTo(models.post, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
    }
  };
  commentaires.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userAvatar: DataTypes.STRING,
    userPseudo: DataTypes.STRING,
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'post',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'commentaires',
  });
  return commentaires;
};