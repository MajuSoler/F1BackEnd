"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reservation.belongsTo(models.table);
      reservation.belongsTo(models.user);
    }
  }
  reservation.init(
    {
      tableId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "reservation",
    }
  );
  return reservation;
};
