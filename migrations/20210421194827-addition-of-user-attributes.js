"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "users",
      "isAdmin",
      { type: Sequelize.BOOLEAN },
      {}
    );

    await queryInterface.addColumn(
      "users",
      "accountBlocked",
      { type: Sequelize.BOOLEAN },
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "isAdmin", {});
    await queryInterface.removeColumn("users", "accountBlocked", {});
  },
};
