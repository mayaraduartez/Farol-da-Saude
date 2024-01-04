"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("turmas", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      turma: Sequelize.STRING,
      CursoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "cursos",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("turmas");
  },
};