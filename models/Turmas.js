const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize");

const Turmas = conexao.define(
  "Turmas",
  {
    turma: {
      type: DataTypes.STRING,
    },
    CursoId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
    tableName: "turmas",
  }
);

module.exports = Turmas;
