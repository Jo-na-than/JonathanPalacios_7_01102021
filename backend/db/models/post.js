'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.posts.belongsTo(models.users, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      })
      models.posts.hasMany(models.commentaires, {
        foreignKey: {
          name: 'postId'
        }
      })
      models.posts.hasMany(models.likes, {
        foreignKey: {
          name: 'postId'
        }
      })
    }
  };
  post.init({
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    content: DataTypes.STRING,
    img_url: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'posts',
  });
  return post;
};