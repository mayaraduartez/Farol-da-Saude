const Sequelize = require("sequelize");
const sequelizeconecta = new Sequelize(
  "db_faroldasaude",
  "postgres",
  "postgres",
  {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
  }
);

module.exports = sequelizeconecta; //exporto