"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      article.hasMany(models.comment);
    }
  }
  article.init(
    {
      url: DataTypes.STRING,
      author: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      img_url: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "article",
    }
  );
  return article;
};
