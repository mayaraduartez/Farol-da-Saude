'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("token", {
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
    token: {
      type: Sequelize.STRING,
    },
    datacriacao: {
      type: Sequelize.DATEONLY,
    },
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("token");
  },
};