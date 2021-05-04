"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "reservations",
      [
        {
          tableId: 1,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tableId: 2,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tableId: 3,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tableId: 4,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tableId: 1,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tableId: 2,
          userId: 2,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("reservations", null, {});
  },
};
