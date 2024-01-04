"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cursos", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      curso: Sequelize.STRING,
      
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cursos");
  },
};