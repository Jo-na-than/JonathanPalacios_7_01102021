// modele table Users
'use strict';

const db = require('../../server'); // fichier où se trouve l'instance sequelize
const crypto = require('crypto')
// function pour crypter et decrypter email
// key et iv pour crypto
let key = crypto.createHash("sha256").update("OMGCAT!", "ascii").digest();
let iv = "1234567890123456";
let algorithm = 'aes-256-ctr'

//function pour encrypter
// function encrypt(text){
// var cipher = crypto.createCipheriv(algorithm,key, iv)
// var crypted = cipher.update(text,'utf8','hex')
// crypted += cipher.final('hex');
// return crypted;
// }

// function pour decrypter
// function decrypt(text){
// var decipher = crypto.createDecipheriv(algorithm,key, iv)
// var dec = decipher.update(text,'hex','utf8')
// dec += decipher.final('utf8');
// return dec;
// }

const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    const users = sequelize.define(
      "Users", {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        nom: {
          allowNull: false,
          type: DataTypes.STRING
        },
        prenom: {
          allowNull: false,
          type: DataTypes.STRING
        },
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          primaryKey: true,
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING
        },
        fonction: {
          allowNull: true,
          type: DataTypes.STRING
        },
        pseudo: {
          allowNull: false,
          type: DataTypes.STRING,
          primaryKey: true,
        },
        avatar: {
          allowNull: true,
          type: DataTypes.STRING
        },
        isAdmin: {
          allowNull: false,
          type: DataTypes.BOOLEAN
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        createPasswordResetToken: {
          allowNull:true,
          type: DataTypes.STRING,
        },
      }, 
      {
        sequelize,
        tableName: "users",
        timeStamps: true,
        indexes: [
          {name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
          },
          {
            name: "email",
            unique: true,
            using: "BTREE",
            fields: [{ name: "email" }],
          },
          {
            name: "pseudo",
            unique: true,
            using: "BTREE",
            fields: [{ name: "pseudo" }],
          },
        ]
      }
    );
    return users
}


