"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("avaliacao", {
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
      avaliador: Sequelize.STRING,
      data_avaliacao: Sequelize.DATEONLY,
      estatura: Sequelize.STRING,
      peso: Sequelize.STRING,
      IMC: Sequelize.STRING,
      FCrep: Sequelize.STRING,
      PASrep: Sequelize.STRING,
      PADrep: Sequelize.STRING,
      GCr: Sequelize.STRING,
      MMr: Sequelize.STRING,
      MMUr: Sequelize.STRING,
      H2O: Sequelize.STRING,
      GordVise: Sequelize.STRING,
      Proteina: Sequelize.STRING,
      TxObes: Sequelize.STRING,
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("avaliacao");
  },
};