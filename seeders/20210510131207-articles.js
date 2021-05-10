"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "articles",
      [
        {
          url: "https://www.bbc.com/sport/formula1/56932825",
          author: "jhon",
          title:
            "'I plan to be here next year' - Hamilton wants to race in 2022 F1 season",
          description:
            "Lewis Hamilton says he intends to remain in Formula 1 for at least another season after this year.",
          content:
            "Lewis Hamilton is one point ahead of Max Verstappen in the Drivers' Championship after two races\r\nLewis Hamilton says he intends to remain in Formula 1 for at least another season after this year.\r\nT… [+3699 chars]",
          img_url:
            "https://ichef.bbci.co.uk/live-experience/cps/624/cpsprodpb/15B2B/production/_118257888_lewishamilton.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("articles", null, {});
  },
};
