const sequelize = require("sequelize");

const conexao = new sequelize(
  "db_faroldasaude",
  "postgres",
  "postgres",
  {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
    dialectOptions: {
      "useUTC": false,
      "timezone":"-03:00"
    },
    "timezone":"-03:00"
  }
);

module.exports = conexao;