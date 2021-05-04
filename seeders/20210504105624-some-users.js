"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          email: "jhon@ymail.com",
          password: "teste",
          scuderia: "Ferrari",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jane Doe",
          email: "jane@ymail.com",
          password: "teste2",
          scuderia: "Mercedes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Mary Doe",
          email: "mary@ymail.com",
          password: "teste3",
          scuderia: "Red Bull",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bill Doe",
          email: "bill@ymail.com",
          password: "teste4",
          scuderia: "Alfa Romeo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bob Doe",
          email: "Bob@ymail.com",
          password: "teste5",
          scuderia: "Aston Martin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
