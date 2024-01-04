"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("avaliacaodae", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      UsuarioId: {
        type: Sequelize.INTEGER,
          references: {
            model: "usuarios",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
      },
      data_avaliacao: Sequelize.DATEONLY,
      perg1: Sequelize.INTEGER,
      perg2: Sequelize.INTEGER,
      perg3: Sequelize.INTEGER,
      perg4: Sequelize.INTEGER,
      perg5: Sequelize.INTEGER,
      perg6: Sequelize.INTEGER,
      perg7: Sequelize.INTEGER,
      perg8: Sequelize.INTEGER,
      perg9: Sequelize.INTEGER,
      perg10: Sequelize.INTEGER,
      perg11: Sequelize.INTEGER,
      perg12: Sequelize.INTEGER,
      perg13: Sequelize.INTEGER,
      perg14: Sequelize.INTEGER,
      perg15: Sequelize.INTEGER,
      perg16: Sequelize.INTEGER,
      perg17: Sequelize.INTEGER,
      perg18: Sequelize.INTEGER,
      perg19: Sequelize.INTEGER,
      perg20: Sequelize.INTEGER,
      perg21: Sequelize.INTEGER,
      estresseScore: Sequelize.INTEGER,
      ansiedadeScore: Sequelize.INTEGER,
      depressaoScore: Sequelize.INTEGER,
      depressao: Sequelize.STRING,
      ansiedade: Sequelize.STRING,
      estresse: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("avaliacaodae");
  },
};