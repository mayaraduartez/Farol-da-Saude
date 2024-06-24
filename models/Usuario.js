const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize");

const Usuario = conexao.define(
  "Usuario",
  {
    foto: {
      type: DataTypes.STRING,
    },
    nome: {
      type: DataTypes.STRING,
    },
    sobrenome: {
      type: DataTypes.STRING,
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
    },
    matricula: {
      type: DataTypes.STRING,
    },
    etnia: {
      type: DataTypes.STRING,
    },
    sexo: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
    },
    TurmaId: {
      type: DataTypes.INTEGER,
    },

  },
  {
    timestamps: false,
    tableName: "usuarios",
  }
);

module.exports = Usuario;