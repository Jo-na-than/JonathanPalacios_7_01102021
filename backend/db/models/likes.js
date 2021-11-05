'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  likes.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
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
    }
  }, {
    sequelize,
    modelName: 'likes',
  });
  return likes;
};