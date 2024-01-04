const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); 

const Curso = conexao.define(
  "Curso",
  {
    curso: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, 
    tableName: "cursos", 
  }
);

module.exports = Curso;