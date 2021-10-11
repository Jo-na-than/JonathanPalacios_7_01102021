// la table commentaires
const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const commentaires = sequelize.define(
    "commentaires",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      commentaires: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      userAvatar: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      userPseudo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "commentaires",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "id",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "userId",
          using: "BTREE",
          fields: [{ name: "userId" }],
        },
        {
          name: "postId",
          using: "BTREE",
          fields: [{ name: "postId" }],
        },
      ],
    }
  );
  return commentaires;
};
