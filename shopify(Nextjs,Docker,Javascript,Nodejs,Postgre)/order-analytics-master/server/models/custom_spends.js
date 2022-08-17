/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return CustomSpend.init(sequelize, DataTypes);
};

class CustomSpend extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        end_data: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        ongoing: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        frequency: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        total_spend: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "custom_spends",
        schema: "public",
      }
    );
    return CustomSpend;
  }
}
