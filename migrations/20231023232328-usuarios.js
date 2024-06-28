"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      foto: Sequelize.STRING,
      nome: {type: Sequelize.STRING, allowNull: false},
      sobrenome: Sequelize.STRING,
      data_nascimento: Sequelize.DATEONLY,
      cpf: { type: Sequelize.STRING, unique:true },
      etnia: Sequelize.STRING,
      sexo: Sequelize.STRING,
      matricula: Sequelize.STRING,
      TurmaId: {
        type: Sequelize.INTEGER,
        references: {
          model: "turmas",
          key: "id",
        },
      },
      email: { type: Sequelize.STRING, allowNull: false, unique:true },
      senha: {type: Sequelize.STRING, allowNull: false},
      admin: { type: Sequelize.BOOLEAN, defaultValue: false }, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};