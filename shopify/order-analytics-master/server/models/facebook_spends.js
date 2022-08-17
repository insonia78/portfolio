/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return FacebookSpend.init(sequelize, DataTypes);
};

class FacebookSpend extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        account_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: "unique_all",
        },
        spend: {
          type: DataTypes.REAL,
          allowNull: false,
        },
        date_start: {
          type: DataTypes.DATE,
          allowNull: true,
          unique: "unique_all",
        },
        date_stop: {
          type: DataTypes.DATE,
          allowNull: true,
          unique: "unique_all",
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: "unique_all",
        },
        campaign_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          unique: "unique_all",
        },
        campaign_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "facebook_spends",
        schema: "public",
        timestamps: false,
      }
    );
    return FacebookSpend;
  }
}
