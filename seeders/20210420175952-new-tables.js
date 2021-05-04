"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "tables",
      [
        {
          seats: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          seats: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tables", null, {});
  },
};
