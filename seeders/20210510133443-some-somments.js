"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "comments",
      [
        {
          userId: 1,
          articleId: 1,
          comment: "This is interesting",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          articleId: 1,
          comment: "This is interesting too!",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("comments", null, {});
  },
};
