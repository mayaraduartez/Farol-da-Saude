const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); 

const Token = conexao.define(
  "Token",
  {
    token: {
      type: DataTypes.STRING,
    },
    datacriacao: {
        type: DataTypes.DATE,
    },
  },
  {
    timestamps: false, 
    tableName: "token", 
  }
);

module.exports = Token;